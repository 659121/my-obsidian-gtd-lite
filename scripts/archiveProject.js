module.exports = async (params) => {
    const { app, quickAddApi } = params;
    const projectFile = app.workspace.getActiveFile();
    const projectFolderPath = projectFile.parent.path;
    let tasks = [];
    new Notice(`Ошибка обработки ${projectFile.parent.path}`);
    const taskFilesList = projectFile.parent.children.filter(file => file.extension === "md");
    //4. Проверка на принадлежность к проекту
    const projectRefs = [
        `[[${projectFile.basename}]]`,
        `[[${projectFile.name}]]`
    ];

    for (const file of taskFilesList) {
        try {
            const content = await app.vault.cachedRead(file);
            // Проверка наличия тега #task
            if (!content.includes("  - task/active") || content.includes("  - project/active")) continue;
            
            // Проверка всех вариантов ссылок
            if (projectRefs.some(ref => content.includes(ref))) {
                tasks.push(file);
            }
        } catch (err) {
            new Notice(`Ошибка обработки ${file.path}:` + err.message);
        }
    }

    if (Array.isArray(tasks) && tasks.length === 0) {
        new Notice("❌ Папка с задачами пуста или в проекте нет задач");
        return;
    }

    await replaceTagInFile(projectFile, "  - project/active", "  - project/archived");
    await replaceTagInFile(projectFile, "task/active", "task/archived");

    // Задачи
    for (const task of tasks){
        await replaceTagInFile(task, "  - task/active", "  - task/archived");
    }

    app.workspace.activeLeaf.detach();
};

async function replaceTagInFile(file, oldTag, newTag) {
    try {
        const content = await app.vault.read(file);
        const newContent = content.replaceAll(oldTag, newTag);
        if (newContent !== content) {
            await app.vault.modify(file, newContent);
            return true;
        }
        return false;
    } catch (err) {
        new Notice(`Ошибка обработки ${file.path}:` + err.message);
        return false;
    }
}