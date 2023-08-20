import { useState } from "react";
import { errorMessage } from "../../utils/errors";

export const usePrint = (pageTitle: string) => {
	const [isLoadingPrint, setIsLoading] = useState(false);
	const [errorPrint, setError] = useState<string | null>(null);

	const handleClickPrint = (event: React.MouseEvent): void => {
		setIsLoading(true);
		try {
			event.stopPropagation();
			const elementToPrint = document.getElementById("to-print");

			let content = "<html><head>";
			content += `<title>${pageTitle}</title>`;
			const styles = document.querySelectorAll("style");
			for (const style of styles) {
				content += "<style>" + style.innerHTML + "</style>";
			}
			content +=
				'</head><body onload="window.print(); setTimeout(window.close, 3000);">';
			if (elementToPrint instanceof HTMLDivElement)
				content += elementToPrint.innerHTML;
			content += "</body>";
			content += "</html>";

			const win = window.open(
				"",
				"",
				"left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
			);
			if (!win) throw new Error("Can not open window");
			win.document.write(content);
			win.document.close();
		} catch (err) {
			setError(errorMessage(err));
		}
		setIsLoading(false);
	};

	return { handleClickPrint, isLoadingPrint, errorPrint };
};
