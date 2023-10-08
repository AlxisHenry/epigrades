import { type Course } from "@/services/courses";

export default function Course({ name, days }: Course) {
	return (
		<div>
			<h1>{name}</h1>
			{
				days.map((day) => {
					return (
						<div>
							<h2>{day.name}</h2>
							<ul>
								<li>{day.assignments}</li>
								<li>{day.due_date}</li>
								<li>{day.submission}</li>
								<li>{day.topic}</li>
								<li>{day.grade}</li>
							</ul>
						</div>
					);
				})
			}
		</div>
	);
}