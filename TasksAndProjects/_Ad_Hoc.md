---
tags:
  - project/active
aliases:
---

```button
name Добавить задачу в проект 
type command
action QuickAdd: Add Task
```
Здесь собраны одноразовые задачи (без привязки к конкретному проекту)
### Связанные задачи
#### Невыполненные
```dataview
TASK
FROM "TasksAndProjects"
WHERE !completed AND any(contains(file.frontmatter.tags, "task/active")) AND contains(file.frontmatter.project, "[[_Ad_Hoc]]")
SORT file.ctime ASC
```
#### Выполненные
```dataview
TASK
FROM "TasksAndProjects"
WHERE completed AND any(contains(file.frontmatter.tags, "task/active")) AND contains(file.frontmatter.project, "[[_Ad_Hoc]]")
SORT file.ctime ASC
```
### 📝Описание и дополнения
	