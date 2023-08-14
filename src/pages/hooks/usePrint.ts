import { useState } from "react";

export const usePrint = (pageTitle) => {
    const [isLoadingPrint, setIsLoading] = useState(false);
    const [errorPrint, setError] = useState(false);

    const handleClickPrint = (event) => {
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
            content += elementToPrint.innerHTML;
            content += "</body>";
            content += "</html>";

            const win = window.openOptions(
                "",
                "",
                "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
            );
            win.document.write(content);
            win.document.close();
        } catch (err) {
            setError(err);
        }
        setIsLoading(false);
    };

    return { handleClickPrint, isLoadingPrint, errorPrint };
};