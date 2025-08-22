module.exports = async (params) => {
    const { app, quickAddApi } = params;
    const projectFile = app.workspace.getActiveFile();
    const folderPath = "TasksAndProjects";

    const confirmed = await quickAddApi.yesNoPrompt(
    `Delete project "${projectFile.basename}"?`,
    "This action cannot be undone."
    );

    if (!confirmed) return;

    let tasks = [];

    const taskFilesList = app.vault.getFiles().filter(file => {
        // Проверяем что файл в нужной папке
        if (!file.path.startsWith(folderPath + "/")) return false;
        const metadata = app.metadataCache.getFileCache(file)?.frontmatter;
        return (metadata?.tags?.includes("task/active") || metadata?.tags?.includes("task/archived"));
    });

    //4. Проверка на принадлежность к проекту
    const projectRefs = [
        `[[${projectFile.basename}]]`,
        `[[${projectFile.name}]]`
    ];

    for (const file of taskFilesList) {
        try {
            const content = await app.vault.cachedRead(file);
            // Проверка всех вариантов ссылок
            if (projectRefs.some(ref => content.includes(ref))) {
                tasks.push(file);
            }
        } catch (err) {
            new Notice(`Ошибка обработки ${file.path}:` + err.message);
        }
    }

    if (Array.isArray(tasks) && tasks.length !== 0) {
        // Задачи
        for (const task of tasks) {
        await this.app.vault.trash(task, true);
        }
    }
    
    await this.app.vault.trash(projectFile, true);
    app.workspace.activeLeaf.detach();
};