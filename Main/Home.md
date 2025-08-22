---
cssClasses:
  - wide-page
---

>[!multi-column] 
>> [!inbox] Inbox
>> ```button
>>name Add inbox
>>type command
>>action QuickAdd: Add Inbox Note
>>```
>> ```dataview
>>LIST
>>FROM #inbox AND !"Templates"
>>SORT file.ctime DESC
>>```
>
>> [!task-list] Next Actions
>>```button
>>name Add task
>>type command
>>action QuickAdd: Add Task
>>```
>>```dataview
>>TASK
>>FROM #task/active AND "TasksAndProjects"
>>WHERE !completed
>>SORT file.ctime ASC
>>```
>
>> [!project-list] Projects
>>```button
>>name Add project
>>type command
>>action QuickAdd: Add Project
>>```
>>```dataview
>>LIST
>>FROM #project/active AND "TasksAndProjects"
>>SORT file.ctime DESC
>>```



>[!multi-column] 
>> [!hub|right-small] Links
>> - [[Contacts.base]]
>> - [[Tasks lifetime.canvas]]
>> - [[Reference]]
>> - [[Someday, maybe]]
>
>> [!shopping] [[Покупки]]
>> ![[Покупки]]
>
>> [!birthdays|wide-5] Contacts/Birthday
>>```button
>>name Add contact
>>type command
>>action QuickAdd: Add Contact
>>```
>>```dataview
>>TABLE date_of_birth AS "🎉🎉🎉"
>>FROM "Contacts"
>>WHERE date_of_birth
>>WHERE (date(date_of_birth).month = date(now).month AND date(date_of_birth).day >= date(now).day) OR ((date(date_of_birth).month = date(now).month + 1 OR date(date_of_birth).month = 12) AND date(now).day > 15)
>>SORT date(date_of_birth).day ASC
>>```


> [!trackers]+ Health & Nutrition
>> [!multi-column] 
>>> [!blank|wide-2] 
>>> ```tracker
>>>searchType: frontmatter
>>>searchTarget: kcal
>>>folder: Daily
>>>startDate: -1M
>>>endDate: 0d
>>>aspectRatio: 15:7
>>>fitPanelWidth: 1
>>>fixedScale: 0.9
>>>line:
>>>	pointSize: 8
>>>	title: Kcal Log
>>>	yAxisLabel: Kcal
>>>	yAxisUnit: kg
>>>	lineColor: "#b16286"
>>>```
>>
>>> [!blank] 
>>> ```tracker
>>>searchType: frontmatter
>>>searchTarget: gym
>>>datasetName: Workouts
>>>folder: Daily
>>>startDate: -1M
>>>endDate: 0d
>>>month:
>>>	startWeekOn: 'Mon'
>>>	color: red
>>>	headerMonthColor: orange
>>>	todayRingColor: white
>>>	selectedRingColor: steelblue
>>>	showSelectedValue: true
>>>```
>
>> [!multi-column] 
>>> [!blank|wide-2] 
>>>```tracker
>>>searchType: frontmatter
>>>searchTarget: weight
>>>folder: Daily
>>>startDate: -1M
>>>endDate: 0d
>>>aspectRatio: 15:7
>>>fitPanelWidth: 1
>>>fixedScale: 0.9
>>>line:
>>>	pointSize: 8
>>>	title: Weight Log
>>>	yAxisLabel: Weight
>>>	yAxisUnit: kg
>>>	lineColor: "#b16286"
>>>```
>>
>>> [!blank] 
>>>```tracker
>>>searchType: frontmatter
>>>searchTarget: weight
>>>folder: Daily
>>>summary:
>>>    template: "First: {{first()}} kg\nLast: {{last()}} kg\nMinimum: {{min()}} kg\nMaximum: {{max()}} kg\nMedian: {{median()}} kg\nAverage: {{average()}} kg"
>>>```