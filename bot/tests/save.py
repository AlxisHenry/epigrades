from utils.json import Json
import json

import sys
# Add the parent directory (project_root) to the Python path
sys.path.append('../')

jsonFile = "../grades.json"
semester = "T5"
courseName = "T-WEB-500_msc2026"
day = "Day 01"
rows = [
    ['Day 01', 'Tasks - Day 01', 'Tuesday, 26 September 2023, 11:42 PM',
        'No submission', '20.00'],
    ['Day 02', 'Tasks - Day 02', 'Wednesday, 27 September 2023, 11:42 PM',
     'No submission', '20.00'],
    ['Day 03', 'Tasks - Day 03', 'Thursday, 28 September 2023, 11:42 PM',
     'No submission', '15.00'],
    ['Day 04 + 05', 'Digital Resume',
     'Sunday, 1 October 2023, 11:42 PM', 'No submission', '16.43'],
    ['Day 06', 'Tasks - Day 06',
     'Tuesday, 3 October 2023, 11:42 PM', 'No submission', '-'],
    ['Day 07', 'Tasks - Day 07',
     'Wednesday, 4 October 2023, 11:42 PM', 'No submission', '-'],
    ['Day 08', 'Tasks - Day 08',
     'Thursday, 5 October 2023, 11:42 PM', 'No submission', '-'],
    ['Day 09', 'Tasks - Day 09', 'Friday, 6 October 2023, 11:42 PM', 'No submission', '-']]

j = Json(file_path="./test.json").load()

print(j.public_check_if_semester_exist(semester))
print(j.public_check_if_course_exist(semester, courseName))
print(j.public_check_if_day_of_course_exist(semester, courseName, day))

print(j.public_add_new_semester(semester))
print(j.public_add_new_course(semester, courseName))

for row in rows:
    j.public_add_or_update_day(semester, courseName, row[0], row)
