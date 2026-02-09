interface EmptyStateProps {
	message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
	return (
		<div className="flex flex-col items-center justify-center p-8 text-gray-500">
			<p className="text-lg">{message}</p>
		</div>
	);
};

export default EmptyState;
