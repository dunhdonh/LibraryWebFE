const SummaryCard = ({ icon, label, value}) => {
    return (
        <div className="bg-white rounded shadow p-4 flex items-center space-x-4">
        <div className="text-blue-500">{icon}</div>
        <div>
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-xl font-bold">{value}</div>
        </div>
        </div>
    );
    }
export default SummaryCard;

