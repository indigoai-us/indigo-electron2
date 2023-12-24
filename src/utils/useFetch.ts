const url = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:8080' 
            : 'https://indigo-api-dev.diffuze.ai';

const useFetch = async (path: string, method: any, body: any, getToken: any) => {	
	const getResponse = await fetch(`${url}${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${await getToken()}`
		},
		body: body ? JSON.stringify(body) : null
	});
	return await getResponse.json();
}

export default useFetch;