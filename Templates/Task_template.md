---
tags:
  - task/active
project: "[[<%*
// Если проект передан извне - используем его, иначе запускаем промпт
  let selectedProject = tp.config.active_file;
  metaDProj = app.metadataCache.getFileCache(selectedProject)?.frontmatter;
  if (metaDProj?.tags?.includes("project/active")) {
	  selectedProject = selectedProject.basename;
	  }
  else {
	  const folderPath = "TasksAndProjects";
	  const files = app.vault.getFiles().filter(file => {
	    if (!file.path.startsWith(folderPath + "/")) return false;
	    const metadata = app.metadataCache.getFileCache(file)?.frontmatter;
	    return metadata?.tags?.includes("project/active");
	  });
	  
	  const fileNames = files.map(file => file.basename);
	
	  if (fileNames.length === 0) {
	    tp.system.prompt("No files found in the specified folder.");
		return;
	  }
	
	 selectedProject = await tp.system.suggester(
		  fileNames,
		  fileNames,
		  false,  // Не выдавать ошибку при отмене вместо возврата null
		  "Select a project"
	  );
  }
%><% selectedProject %>]]"
---

>[!multi-column]
>>[!blank|min-0]
>>```button
>>name Archive
>>type command
>>action QuickAdd: Archive Task
>>```
>
>>[!blank|min-0]
>>```button
>>name Delete task
>>type command
>>action QuickAdd: Delete Task
>>```
>
>>[!blank]
>>
## Project: "[[<% selectedProject %>]]"

- [ ] <% tp.file.title %>
### 🎯Цели задачи или ожидаемый результат
- <% tp.file.cursor(1) %>
### 📝Описание и дополнения
	<% tp.file.cursor(2) %>

