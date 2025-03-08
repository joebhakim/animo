interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <div className="space-y-4">
                    <p className="text-gray-700">
                        HA! You think I need your stinking COFFEE!? <strong>NO THANKS FRIENDO 😊</strong>
                    </p>
                    <p>
                        If youve really got too much money, so much that it hurts,
                        consider donating to <strong>Médecins Sans Frontières </strong>
                        (MSF) (Doctors Without Borders) instead. They provide vital
                        medical care to those who need it most around the world, and
                        overall are a bunch of good eggs.
                    </p>
                    <div className="flex space-x-3">
                        <a
                            href="https://www.msf.org/donate"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center transition-colors"
                        >
                            Donate to MSF
                        </a>
                        <button
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
} 