import json
from datetime import datetime


class Json:

    def __init__(self, file_path) -> None:
        self.file_path = file_path
        self.json = None

    def load(self):
        with open(self.file_path, 'r') as outfile:
            self.json = json.load(outfile)
        return self

    def public_add_new_semester(self, semester):
        if not self.public_check_if_semester_exist(semester):
            with open(self.file_path, 'w') as outfile:
                self.json['semesters'].append({
                    "name": semester,
                    "courses": []
                })
                json.dump(self.json, outfile)
            return self
        else:
            return False

    def public_add_new_course(self, semester, course_name):
        if not self.public_check_if_course_exist(semester, course_name):
            with open(self.file_path, 'w') as outfile:
                for s in self.json['semesters']:
                    if s['name'] == semester:
                        s['courses'].append({
                            "name": course_name,
                            "days": []
                        })
                json.dump(self.json, outfile)
            return self
        else:
            return False

    def public_add_or_update_day(self, semester, course_name, day, data):
        formatted_data = self.format_day_data_to_object(data)
        if not self.public_check_if_day_of_course_exist(semester, course_name, day):
            with open(self.file_path, 'w') as outfile:
                for s in self.json['semesters']:
                    if s['name'] == semester:
                        for c in s['courses']:
                            if c['name'] == course_name:
                                c['days'].append(formatted_data)
                json.dump(self.json, outfile)
        else:
            self.public_update_day(semester, course_name, day, formatted_data)
            return self

    def public_check_if_semester_exist(self, semester):
        return any(s['name'] == semester for s in self.json['semesters'])

    def public_check_if_day_of_course_exist(self, semester, course_name, day):
        for s in self.json['semesters']:
            if s['name'] == semester:
                for c in s['courses']:
                    if c['name'] == course_name:
                        for d in c['days']:
                            if d['name'] == day:
                                return True
        return False

    def public_check_if_course_exist(self, semester, course_name):
        for s in self.json['semesters']:
            if s['name'] == semester:
                for c in s['courses']:
                    if c['name'] == course_name:
                        return True
        return False

    def public_update_day(self, semester, course_name, day, data):
        with open(self.file_path, 'w') as outfile:
            for s in self.json['semesters']:
                if s['name'] == semester:
                    for c in s['courses']:
                        if c['name'] == course_name:
                            for d in c['days']:
                                if d['name'] == day:
                                    d['assignments'] = data['assignments']
                                    d['due_date'] = data['due_date']
                                    d['submission'] = data['submission']
                                    d['grade'] = data['grade']
            json.dump(self.json, outfile)
        return self

    def format_day_data_to_object(self, data):
        return {
            "name": data[0],
            "topic": data[0],
            "assignments": data[1],
            "due_date": self.format_due_date(date=data[2]),
            "submission": data[3],
            "grade": data[4]
        }

    def format_due_date(self, date):
        try:
            d = datetime.strptime(date, "%A, %d %B %Y, %I:%M %p")
            formatted = d.strftime("%Y-%m-%d %H:%M:%S")
        except Exception as e:
            formatted = date
        return formatted

    def __del__(self):
        self.json = None
