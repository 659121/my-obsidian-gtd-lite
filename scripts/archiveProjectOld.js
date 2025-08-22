module.exports = async (params) => {
    const { app, quickAddApi } = params;
    const pathToTaskAndProjectsFolder = "TasksAndProjects";

    // 1. Получаем все проекты с их полными путями
    const projectFiles = (await Promise.all(
        app.vault.getMarkdownFiles()
            .filter(file => file.path.startsWith(pathToTaskAndProjectsFolder) && !file.basename.startsWith(`_`))
            .map(async file => {
                const content = await app.vault.read(file);
                return content.includes("#project") ? file : null;
            })
    )).filter(Boolean); // Удаляет null (файлы без тега)

    if (projectFiles.length === 0) {
        new Notice(`❌ Не найдено ни одного проекта в папке ${pathToTaskAndProjectsFolder}!`);
        return;
    }

    // 2. Выбор проекта (показываем имя, но возвращаем полный путь)
    const selectedProject = await quickAddApi.suggester(
        projectFiles.map(f => f.basename),
        projectFiles // Возвращаем сами файлы
    );
    
    if (!selectedProject) return;
    
    // 3. Поиск задач
    let tasks = [];
    const tasksFolder = app.vault.getAbstractFileByPath(pathToTaskAndProjectsFolder);
    if (!tasksFolder || !tasksFolder.children) {
        new Notice("❌ Папка Tasks не найдена или пуста");
        return;
    }
    const taskFiles = tasksFolder.children.filter(file => file.extension === "md");
    
    //4. Проверка на принадлежность к проекту
    const projectRefs = [
        `[[${selectedProject.basename}]]`,
        `[[${selectedProject.name}]]`
    ];
    for (const file of taskFiles) {
        try {
            const content = await app.vault.cachedRead(file);
            // Проверка наличия тега #task
            if (!content.includes("#task")) continue;
            if (content.includes("#project")) continue;
            
            // Проверка всех вариантов ссылок
            if (projectRefs.some(ref => content.includes(ref))) {
                tasks.push(file);
            }
        } catch (err) {
            new Notice(`Ошибка обработки ${file.path}:` + err.message);
        }
    }
    
    let linksToChange = [];
    // 5. Перемещение
    try {
        // Проект
        const newProjectPath = `Archive/TasksAndProjects/${selectedProject.name}`;
        linksToChange.push([selectedProject.basename, newProjectPath + `|` + selectedProject.basename]);
        await moveFile(selectedProject, newProjectPath);
        await replaceTagInFile(app.vault.getAbstractFileByPath(newProjectPath), "#project", "#project/archived");
        await replaceTagInFile(app.vault.getAbstractFileByPath(newProjectPath), "#task", "#task/archived");

        // Задачи
        for (const task of tasks){
            const newTaskPath = `Archive/TasksAndProjects/${task.name}`;
            linksToChange.push([task.basename, newTaskPath + `|` + task.basename]);
            await moveFile(task, newTaskPath);
            await replaceTagInFile(app.vault.getAbstractFileByPath(newTaskPath), "#task", "#task/archived");
        }
        
        // Обновляем ссылки
        const files = app.vault.getMarkdownFiles();
        let updatedCount = 0;
        
        for (const file of files) {
            for (const [oldLink, newLink] of linksToChange) {
                if (await updateLinksInFile(file, oldLink, newLink))
                    updatedCount++;
            }
        }

        new Notice(`Обновлены ссылки в ${updatedCount} файлах`);
        new Notice(`✅ Проект и ${tasks.length} задач(и) архивированы!`);
    } catch (err) {
        new Notice("❌ Ошибка перемещения: " + err.message);
    }
};

async function replaceTagInFile(file, oldTag, newTag) {
    try {
        let content = await app.vault.read(file);
        
        // Поддержка разных форматов тегов: #tag, #tag/subtag, #tag/subtag/subsub
        const normalizedOldTag = oldTag.startsWith('#') ? oldTag : `#${oldTag}`;
        const normalizedNewTag = newTag.startsWith('#') ? newTag : `#${newTag}`;
        
        // Регулярное выражение учитывает разные варианты написания
        const tagRegex = new RegExp(
            `(["']|\\s|^)${normalizedOldTag.replace('#', '\\#')}\\b(?!\/)`, 
            'g'
        );
        
        const newContent = content.replace(
            tagRegex, 
            `$1${normalizedNewTag}`
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

async function updateLinksInFile(file, oldLink, newLink) {
    try {
        let content = await app.vault.read(file);
        
        // Создаем regex для всех вариантов ссылок
        const oldLinkBasename = oldLink.split('/').pop().replace('.md', '');
        const linkRegex = new RegExp(
            `\\[\\[(${oldLinkBasename}|${escapeRegExp(oldLink)})\\]\\]`,
            'g'
        );
        
        // Заменяем все старые ссылки на новые
        const newContent = content.replace(
            linkRegex,
            `[[${newLink}]]`
        );
        
        if (newContent !== content) {
            await app.vault.modify(file, newContent);
            return true;
        }
        return false;
    } catch (err) {
        console.error(`Ошибка обновления ссылок в ${file.path}`);
        return false;
    }
}

// Вспомогательная функция для экранирования спецсимволов в regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function moveFile(file, newPath) {
    try {
        const newContent = await app.vault.read(file);
        await app.vault.create(newPath, newContent);
        await app.vault.delete(file);
        return true;
    } catch (err) {
        console.error("Ошибка перемещения:" + err.message);
        return false;
    }
}