module.exports = async (params) => {
    const { app, quickAddApi } = params;
    const task = app.workspace.getActiveFile();
    content = await app.vault.cachedRead(task);
    if (content.includes("- [ ] ")){
        new Notice(`❌ Задача ${task.basename} не может быть перемещена в архив, если она не выполнена, только удалена`);
    }
    else {
        await replaceTagInFile(task, "  - task/active", "  - task/archived");
        new Notice(`Задача ${task.basename} перемещена в архив`);
        app.workspace.activeLeaf.detach();
    }
};

async function replaceTagInFile(file, oldTag, newTag) {
    try {
        let content = await app.vault.read(file);
        const newContent = content.replace(
            oldTag,
            newTag
        );
        
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