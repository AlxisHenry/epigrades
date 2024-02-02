export const HasReport = ({
	email,
	uuid,
	generateNewReport,
}: {
	email: string;
	uuid: string;
	generateNewReport: (fromModal: boolean) => void;
}) => {
	return (
		<div className="modal">
			<div
				className="modal-content"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "center",
					gap: "1rem",
				}}
			>
				<h2>Hey, we found a report for you!</h2>
				<p>Do you want to continue with the previous report? Or make a new one?</p>
				<div
					style={{
						display: "flex",
						width: "100%",
						gap: "1rem",
						marginTop: "20px",
					}}
				>
					<button
						style={{
							flex: 1,
						}}
						onClick={() => {
							location.href = `/online/${uuid}`;
						}}
						type="submit"
					>
						Continue
					</button>
					<button
						style={{
							flex: 1,
						}}
						type="submit"
						onClick={() => generateNewReport(true)}
					>
						Make a new one
					</button>
				</div>
			</div>
		</div>
	);
};
