import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

type Team = {
  name: string;
  occurrences: number;
  color: string;
  percentage: number;
};

export function GET(request: NextRequest): ImageResponse {
  const p = request.nextUrl.searchParams.get("teams") || "";

  const teams: Team[] = p.split(",").map((team) => {
    const [name, occurrences] = team.split("-");

    return {
      name,
      occurrences: +occurrences,
      color: `hsla(${~~(360 * Math.random())}, 70%,  72%, 0.8)`,
      percentage: 0,
    };
  });

  const nbOfOccurrences = teams.reduce(
    (acc, team) => acc + team.occurrences,
    0
  );

  teams.map((team, i) => {
    team.percentage = Math.round((team.occurrences / nbOfOccurrences) * 100);
    return team;
  });

  return new ImageResponse(
    (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "300px",
            justifyContent: "center",
            alignItems: "center",
            gap: "25px",
            backgroundColor: "black",
          }}
        >
          <ul
            style={{
              display: "flex",
              flexDirection: "row",
              width: "90%",
              height: "130px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
              border: "1px solid black",
            }}
          >
            {teams.map((team) => (
              <Team team={team} key={team.name} />
            ))}
          </ul>
          <Legend teams={teams} />
        </div>
      </>
    ),
    {
      width: 1280,
      height: 300,
    }
  );
}

interface TeamProps {
  team: Team;
}

const Team = ({ team }: TeamProps) => {
  const { occurrences, color, percentage } = team;

  return (
    <li
      style={{
        flex: occurrences,
        backgroundColor: color,
        minWidth: "60px",
        height: "100%",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5rem",
        fontWeight: "bold",
        borderRight: "1px solid black",
      }}
    >
      {percentage}%
    </li>
  );
};

interface LegendProps {
  teams: Team[];
}

const Legend = ({ teams }: LegendProps) => {
  return (
    <ul
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      {teams.map((team) => (
        <li
          key={`legend-${team.name}`}
          style={{
            height: "100%",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            gap: "10px",
          }}
        >
          <span
            className="circle"
            style={{
              backgroundColor: team.color,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
            }}
          ></span>
          {team.name}
        </li>
      ))}
    </ul>
  );
};
