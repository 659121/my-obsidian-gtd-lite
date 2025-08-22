---
tags:
  - project/active
aliases:
---

>[!multi-column]
>>[!blank|min-0]
>>```button
>>name Archive
>>type command
>>action QuickAdd: Archive Project
>>```
>
>>[!blank|min-0]
>>```button
>>name Delete project
>>type command
>>action QuickAdd: Delete Project
>>```
>
>>[!blank|min-0]
>>```button
>>name Add task to this project
>>type command
>>action QuickAdd: Add Task
>>```
### 🎯Цели проекта
- <% tp.file.cursor(1) %>

### Связанные задачи
```dataview
TASK
FROM "TasksAndProjects"
WHERE any(contains(file.frontmatter.tags, "task/active")) AND contains(file.frontmatter.project, "[[<% tp.file.title %>]]")
SORT file.ctime ASC
```

### 📝Описание и дополнения
	<% tp.file.cursor(2) %>