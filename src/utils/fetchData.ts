const getSuspender = (promise: Promise<Response>) => {
	let status = "pending";
	let response: Response;

	const suspender = promise.then(
		(res) => {
			status = "success";
			response = res;
		},
		(err) => {
			status = "error";
			response = err;
		}
	);

	const read = () => {
		switch (status) {
			case "pending":
				throw suspender;
			case "error":
				throw response;
			default:
				return response;
		}
	};

	return { read };
};

export const fetchData = (url: string) => {
	const promise = fetch(url)
		.then((response) => response.json())
		.then((data) => data);

	return getSuspender(promise);
};

// import { Suspense } from "react";
// const url = "";
// const apiData = fetchData(url);

// const ExampleComponent = () => {
// 	const data = apiData.read();

// 	return (
// 		<div>
// 			<h1>Fetch like a Pro</h1>
// 			<Suspense fallback={<div>Loading...</div>}>
// 				<ul className="card">
// 					{data?.map((item) => (
// 						<li key={item.id}>{item.title}</li>
// 					))}
// 				</ul>
// 			</Suspense>
// 		</div>
// 	);
// };
