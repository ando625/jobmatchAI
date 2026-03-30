'use client'

type Props = {
    job: { title: string; description: string };
    onClose: () => void;
};

export default function JobModal({ job, onClose }: Props)
{
    return (
        // オーバーレイ
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
            className="bg-black/50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* モーダル本体 */}
            <div className="bg-white w-2/3" onClick={(e)=> e.stopPropagation()}>
                <div onClick={onClose} className="mr-10">✖️</div>
                <h2 className="font-bold">{ job.title}</h2>
                <p className="text-gray-400 text-sm">{ job.description}</p>

            </div>
        </div>
    )

}