"use client";

type Props = {
	title: string;
};

export default function SemesterTitle({ title }: Props) {
  return (
    <div className="semester__title">
			<div className="semester__title__text">{title}</div>
    </div>
  );
}
