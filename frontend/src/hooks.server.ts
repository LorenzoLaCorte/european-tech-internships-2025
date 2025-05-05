export const handleError = ({ error, event }: { error: unknown; event: { url: URL } }) => {
	console.error('Global error in event:', event.url);
	console.error(error);
	return { message: 'Internal Server Error' };
};
