export default function ActivityDetails({ activity }) {
    const { metadata = {}, actor } = activity;
    console.log(metadata);

    return (
        <div className="space-y-1 text-sm">
            {/* Actor */}
            {actor && (
                <div>
                    <span className="font-medium">{actor.first_name} {actor.last_name}</span> <span className="text-muted-foreground">performed this action</span>
                </div>
            )}

            {/* Stage change */}
            {metadata.from && metadata.to && (
                <div className="text-muted-foreground">
                    Stage changed from <span className="font-medium">{metadata.from}</span> → <span className="font-medium">{metadata.to}</span>
                </div>
            )}

            {/* Interview schedule */}
            {metadata.interview_scheduled_at && (
                <div className="text-muted-foreground">
                    Interview scheduled on <span className="font-medium">{new Date(metadata.interview_scheduled_at).toLocaleString()}</span>
                </div>
            )}

            {/* Candidate info */}
            {metadata.candidate_name && (
                <div className="text-muted-foreground">
                    Candidate: <span className="font-medium">{metadata.candidate_name}</span>
                </div>
            )}
        </div>
    );
}
