export const  increaseIncrement = (num) => {
    // Handle cases where num is 0 or negative
    if (num <= 0) {
        throw new Error("Number must be positive and non-zero");
    }

    // Determine the order of magnitude (N)
    const magnitude = Math.pow(10, Math.floor(Math.log10(num)));

    // Normalize num to a range of [1, 10) by dividing by its magnitude
    const normalized = num / magnitude;

    // Determine the next number based on normalized value
    let result;
    if (normalized < 2) {
        result = 2 * magnitude; // 1 * 10^N -> 2 * 10^N
    } else if (normalized < 5) {
        result = 5 * magnitude; // 2 * 10^N -> 5 * 10^N
    } else {
        result = 10 * magnitude; // 5 * 10^N -> 1 * 10^(N+1)
    }

    // Return the result, ensuring it maintains precision by using toFixed() to avoid small floating-point errors
    return parseFloat(result.toPrecision(7)); // Precision safe without rounding to zero
}

export const decreaseIncrement = (num) =>{
    // Handle cases where num is 0 or negative
    if (num <= 0) {
        throw new Error("Number must be positive and non-zero");
    }

    // Determine the order of magnitude (N)
    const magnitude = Math.pow(10, Math.floor(Math.log10(num)));

    // Normalize num to a range of [1, 10) by dividing by its magnitude
    const normalized = num / magnitude;

    // Special case: If normalized is exactly 1, drop to 5 * 10^(N-1)
    let result;
    if (normalized === 1) {
        result = 5 * (magnitude / 10); // e.g., 1 -> 5 of previous magnitude (e.g., 10 -> 5)
    } else if (normalized > 5) {
        result = 5 * magnitude; // 10 * 10^N -> 5 * 10^N
    } else if (normalized > 2) {
        result = 2 * magnitude; // 5 * 10^N -> 2 * 10^N
    } else {
        result = 1 * magnitude; // 2 * 10^N -> 1 * 10^N
    }

    // Return the result, ensuring it maintains precision by using toPrecision() to avoid small floating-point errors
    return parseFloat(result.toPrecision(15)); // Precision safe without rounding to zero
}