module.exports = async function(params) {
    const { app, quickAddApi } = params;
    const tp = app.plugins.getPlugin("templater-obsidian").templater.current_functions_object;
    const activeFile = app.workspace.getActiveFile();

    const templateFile = app.vault.getAbstractFileByPath("Templates/Task_template.md");
    const templateContent = await app.vault.read(templateFile);
    const taskName = await quickAddApi.inputPrompt("Название задачи:");
    if (!taskName) return;
    // 2. Создаем контекст для Templater
    await tp.file.create_new(
        templateFile, 
        true, 
        app.vault.getAbstractFileByPath("TasksAndProject"), // Папка назначения
        {
            // Переменные для шаблона
            project_from_quickadd: activeFile.basename,
            title: taskName
        }
    );
    new Notice(`✅ Задача создана для проекта [[${activeFile.basename}]]`, 3000);
};