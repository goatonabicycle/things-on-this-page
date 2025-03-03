export const cookieDetector = {
	getCookies(): { name: string; value: string; fullWidth?: boolean }[] {
		const cookies = document.cookie
			.split(";")
			.filter((cookie) => cookie.trim() !== "");

		const result = [
			{ name: "Cookies detected", value: cookies.length.toString() },
		];

		if (cookies.length > 0) {
			let cookieTable =
				'<table class="compact-table"><thead><tr><th>Cookie Name</th><th>Value</th></tr></thead><tbody>';

			for (const cookie of cookies) {
				const name = cookie.split("=")[0].trim();
				const value = cookie.split("=")[1] || "";

				let displayValue = value;
				if (value.length > 30) {
					displayValue = `${value.substring(0, 27)}...`;
				}

				displayValue = displayValue
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#039;");

				cookieTable += `<tr>
          <td>${name}</td>
          <td title="${value}">${displayValue}</td>
        </tr>`;
			}

			cookieTable += "</tbody></table>";

			result.push({
				name: "Cookie Details",
				value: cookieTable,
				fullWidth: true,
			});
		}

		return result;
	},
};
