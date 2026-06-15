function formatActivityTime(createdAt) {
    console.log('created at', createdAt)
    if (!createdAt) {
        console.log("❌ No createdAt provided");
        return "Just now";
    }

    // Backend UTC dates
    const createdUTC = new Date(createdAt);
    const nowUTC = new Date();
    const message_time = createdUTC.toLocaleDateString("en-IN", { minute: '2-digit', month: 'short', year: 'numeric' })
    console.log("🕒 createdUTC (ISO):", createdUTC);
    console.log("🕒 nowUTC (ISO):", nowUTC);

    // IST offset
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    // Convert UTC → IST
    const createdIST = new Date(createdUTC.getTime() + IST_OFFSET_MS);
    const nowIST = new Date(nowUTC.getTime());

    console.log("🇮🇳 createdIST (local string):", createdIST.toString());
    console.log("🇮🇳 nowIST (local string):", nowIST.toString());

    // Differences
    const diffMs = nowIST.getTime() - createdIST.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    console.log("⏱ diffMs:", diffMs);
    console.log("⏱ diffMinutes:", diffMinutes);
    console.log("⏱ diffHours:", diffHours);
    console.log("⏱ diffDays:", diffDays);

    // Output decision
    let result;
    if (diffMinutes < 2) result = "Just now";
    else if (diffMinutes < 60) result = `${diffMinutes} mins ago`;
    else if (diffHours < 24) result = `${diffHours} hours ago`;
    else
        result = `${diffDays === 1 ? 'day ago' : message_time}`;

    console.log("✅ Final output:", result);

    return result;
}

export default formatActivityTime;
