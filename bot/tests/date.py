from datetime import datetime

input_date_string="Monday, 6 September 2021, 10:00 AM"

# Parse the input date string into a datetime object
input_datetime = datetime.strptime(input_date_string, "%A, %d %B %Y, %I:%M %p")

# Format the datetime object into the desired output format
output_date_string = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

print(output_date_string)