import React, { useState } from 'react';

const ExceptionInbox = ({ exceptions, onAddComment }) => {
    const [selectedException, setSelectedException] = useState(null);
    const [commentText, setCommentText] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        onAddComment(selectedException.id, commentText);
        setCommentText('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg h-[600px]">
            {/* Exception List */}
            <div className="card lg:col-span-1 flex flex-col overflow-hidden">
                <div className="card-header">
                    <h3 className="card-title">Alerts & Exceptions</h3>
                </div>
                <div className="overflow-y-auto flex-1 p-sm">
                    {exceptions.map(ex => (
                        <div
                            key={ex.id}
                            className={`p-md mb-sm rounded-lg cursor-pointer border transition-all ${selectedException?.id === ex.id
                                    ? 'bg-bg-tertiary border-primary'
                                    : 'bg-glass-bg border-border hover:bg-bg-tertiary'
                                }`}
                            onClick={() => setSelectedException(ex)}
                        >
                            <div className="flex justify-between items-start mb-xs">
                                <span className={`badge ${ex.severity === 'high' ? 'badge-danger' :
                                        ex.severity === 'medium' ? 'badge-warning' : 'badge-info'
                                    }`}>
                                    {ex.severity.toUpperCase()}
                                </span>
                                <span className="text-xs text-tertiary">
                                    {new Date(ex.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h4 className="font-semibold text-sm mb-xs">{ex.title}</h4>
                            <p className="text-xs text-secondary truncate">{ex.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail View */}
            <div className="card lg:col-span-2 flex flex-col">
                {selectedException ? (
                    <>
                        <div className="card-header border-b border-border">
                            <div>
                                <h3 className="card-title text-xl">{selectedException.title}</h3>
                                <div className="flex gap-md mt-xs text-sm text-secondary">
                                    <span>ID: {selectedException.id}</span>
                                    <span>Type: {selectedException.type}</span>
                                    <span>Status: {selectedException.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-lg border-b border-border bg-bg-tertiary">
                            <p>{selectedException.description}</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-lg">
                            <h4 className="text-sm font-semibold mb-md text-tertiary">Collaboration Log</h4>
                            {selectedException.comments.length === 0 ? (
                                <p className="text-tertiary italic text-sm">No comments yet.</p>
                            ) : (
                                <div className="flex flex-col gap-md">
                                    {selectedException.comments.map(comment => (
                                        <div key={comment.id} className="flex gap-sm">
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                                                {comment.author.charAt(0)}
                                            </div>
                                            <div className="bg-bg-secondary p-sm rounded-lg rounded-tl-none border border-border flex-1">
                                                <div className="flex justify-between items-center mb-xs">
                                                    <span className="font-semibold text-xs">{comment.author}</span>
                                                    <span className="text-xs text-tertiary">
                                                        {new Date(comment.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-md border-t border-border">
                            <form onSubmit={handleCommentSubmit} className="flex gap-sm">
                                <input
                                    type="text"
                                    className="form-input flex-1"
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">Send</button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-tertiary">
                        Select an exception to view details
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExceptionInbox;
