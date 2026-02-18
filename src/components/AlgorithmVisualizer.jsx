import React, { useRef, useState, useEffect, useCallback } from 'react';

const ALGO_LIST = [
    { key: 'bubble', label: 'Bubble Sort' },
    { key: 'selection', label: 'Selection Sort' },
    { key: 'insertion', label: 'Insertion Sort' },
    { key: 'merge', label: 'Merge Sort' },
    { key: 'quick', label: 'Quick Sort' },
    { key: 'heap', label: 'Heap Sort' },
];

const BAR_COUNT = 30;
const BASE_DELAY = 60;

// ── Sorting generators (yield comparison / swap frames) ──────────────

function* bubbleSortGen(arr) {
    const a = [...arr];
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
            yield { array: [...a], comparing: [j, j + 1], sorted: a.length - i };
            if (a[j] > a[j + 1]) {
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
                yield { array: [...a], swapped: [j, j + 1], sorted: a.length - i };
            }
        }
    }
    yield { array: [...a], done: true };
}

function* selectionSortGen(arr) {
    const a = [...arr];
    for (let i = 0; i < a.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < a.length; j++) {
            yield { array: [...a], comparing: [minIdx, j], sorted: i };
            if (a[j] < a[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
            [a[i], a[minIdx]] = [a[minIdx], a[i]];
            yield { array: [...a], swapped: [i, minIdx], sorted: i };
        }
    }
    yield { array: [...a], done: true };
}

function* insertionSortGen(arr) {
    const a = [...arr];
    for (let i = 1; i < a.length; i++) {
        let j = i;
        while (j > 0 && a[j - 1] > a[j]) {
            yield { array: [...a], comparing: [j - 1, j], sorted: -1 };
            [a[j - 1], a[j]] = [a[j], a[j - 1]];
            yield { array: [...a], swapped: [j - 1, j], sorted: -1 };
            j--;
        }
    }
    yield { array: [...a], done: true };
}

function* mergeSortGen(arr) {
    const a = [...arr];
    function* merge(l, m, r) {
        const left = a.slice(l, m + 1);
        const right = a.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            yield { array: [...a], comparing: [l + i, m + 1 + j], sorted: -1, range: [l, r] };
            if (left[i] <= right[j]) {
                a[k++] = left[i++];
            } else {
                a[k++] = right[j++];
            }
            yield { array: [...a], swapped: [k - 1], sorted: -1, range: [l, r] };
        }
        while (i < left.length) { a[k++] = left[i++]; yield { array: [...a], swapped: [k - 1], sorted: -1 }; }
        while (j < right.length) { a[k++] = right[j++]; yield { array: [...a], swapped: [k - 1], sorted: -1 }; }
    }
    function* sort(l, r) {
        if (l < r) {
            const m = Math.floor((l + r) / 2);
            yield* sort(l, m);
            yield* sort(m + 1, r);
            yield* merge(l, m, r);
        }
    }
    yield* sort(0, a.length - 1);
    yield { array: [...a], done: true };
}

function* quickSortGen(arr) {
    const a = [...arr];
    function* partition(low, high) {
        const pivot = a[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            yield { array: [...a], comparing: [j, high], sorted: -1 };
            if (a[j] < pivot) {
                i++;
                [a[i], a[j]] = [a[j], a[i]];
                yield { array: [...a], swapped: [i, j], sorted: -1 };
            }
        }
        [a[i + 1], a[high]] = [a[high], a[i + 1]];
        yield { array: [...a], swapped: [i + 1, high], sorted: -1 };
        return i + 1;
    }
    function* sort(low, high) {
        if (low < high) {
            const pi = yield* partition(low, high);
            yield* sort(low, pi - 1);
            yield* sort(pi + 1, high);
        }
    }
    yield* sort(0, a.length - 1);
    yield { array: [...a], done: true };
}

function* heapSortGen(arr) {
    const a = [...arr];
    const n = a.length;

    function* heapify(n, i) {
        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;

        if (l < n) {
            yield { array: [...a], comparing: [largest, l], sorted: -1 };
            if (a[l] > a[largest]) largest = l;
        }
        if (r < n) {
            yield { array: [...a], comparing: [largest, r], sorted: -1 };
            if (a[r] > a[largest]) largest = r;
        }

        if (largest !== i) {
            [a[i], a[largest]] = [a[largest], a[i]];
            yield { array: [...a], swapped: [i, largest], sorted: -1 };
            yield* heapify(n, largest);
        }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [a[0], a[i]] = [a[i], a[0]];
        yield { array: [...a], swapped: [0, i], sorted: i };
        yield* heapify(i, 0);
    }
    yield { array: [...a], done: true };
}

const GENERATORS = {
    bubble: bubbleSortGen,
    selection: selectionSortGen,
    insertion: insertionSortGen,
    merge: mergeSortGen,
    quick: quickSortGen,
    heap: heapSortGen,
};

// ── Descriptions ─────────────────────────────────────────────────────

const DESCRIPTIONS = {
    bubble: 'Repeatedly swaps adjacent elements if they are in wrong order until the list is sorted.',
    selection: 'Finds the minimum element and places it at the beginning, repeating for each position.',
    insertion: 'Builds a sorted section one element at a time by inserting each into its correct position.',
    merge: 'Divides the array in half, recursively sorts each half, and merges them back together.',
    quick: 'Picks a "pivot" element and partitions the array into elements smaller and larger than the pivot.',
    heap: 'Converts array into a binary heap structure, then repeatedly extracts the max element.',
};

// ── Pseudocode ───────────────────────────────────────────────────────

const PSEUDOCODE = {
    bubble: [
        "procedure bubbleSort(arr):",
        "  n = length(arr)",
        "  for i = 0 to n-1:",
        "    // Last i elements are already in place",
        "    for j = 0 to n-i-2:",
        "      // Compare adjacent elements",
        "      if arr[j] > arr[j+1]:",
        "        swap(arr[j], arr[j+1])"
    ],
    selection: [
        "procedure selectionSort(arr):",
        "  n = length(arr)",
        "  for i = 0 to n-1:",
        "    // Find minimum in remaining unsorted array",
        "    min_idx = i",
        "    for j = i+1 to n-1:",
        "      if arr[j] < arr[min_idx]:",
        "        min_idx = j",
        "    // Swap found minimum with first element",
        "    if min_idx != i:",
        "      swap(arr[i], arr[min_idx])"
    ],
    insertion: [
        "procedure insertionSort(arr):",
        "  n = length(arr)",
        "  for i = 1 to n-1:",
        "    key = arr[i]",
        "    j = i - 1",
        "    // Move elements greater than key one position ahead",
        "    while j >= 0 and arr[j] > key:",
        "      arr[j+1] = arr[j]",
        "      j = j - 1",
        "    arr[j+1] = key"
    ],
    merge: [
        "procedure mergeSort(arr, left, right):",
        "  if left < right:",
        "    mid = (left + right) / 2",
        "    mergeSort(arr, left, mid)",
        "    mergeSort(arr, mid + 1, right)",
        "    ",
        "    // Merge two sorted halves",
        "    L = arr[left..mid], R = arr[mid+1..right]",
        "    i = 0, j = 0, k = left",
        "    while i < len(L) and j < len(R):",
        "      if L[i] <= R[j]:",
        "        arr[k] = L[i]; i++",
        "      else:",
        "        arr[k] = R[j]; j++",
        "      k++",
        "    // Copy remaining elements",
        "    while i < len(L): arr[k++] = L[i++]",
        "    while j < len(R): arr[k++] = R[j++]"
    ],
    quick: [
        "procedure quickSort(arr, low, high):",
        "  if low < high:",
        "    // Partition Logic",
        "    pivot = arr[high]",
        "    i = low - 1  // Index of smaller element",
        "    for j = low to high - 1:",
        "      if arr[j] < pivot:",
        "        i++",
        "        swap(arr[i], arr[j])",
        "    swap(arr[i + 1], arr[high])",
        "    pi = i + 1  // Partition index",
        "    ",
        "    // Recursively sort elements before/after partition",
        "    quickSort(arr, low, pi - 1)",
        "    quickSort(arr, pi + 1, high)"
    ],
    heap: [
        "procedure heapSort(arr):",
        "  n = length(arr)",
        "  // Build max heap",
        "  for i = n/2 - 1 down to 0:",
        "    heapify(arr, n, i)",
        "  // One by one extract element from heap",
        "  for i = n - 1 down to 0:",
        "    swap(arr[0], arr[i])",
        "    heapify(arr, i, 0)",
        "",
        "procedure heapify(arr, n, i):",
        "  largest = i",
        "  left = 2*i + 1",
        "  right = 2*i + 2",
        "  if left < n and arr[left] > arr[largest]:",
        "    largest = left",
        "  if right < n and arr[right] > arr[largest]:",
        "    largest = right",
        "  if largest != i:",
        "    swap(arr[i], arr[largest])",
        "    heapify(arr, n, largest)"
    ]
};

// ── Generate random array ────────────────────────────────────────────

const randomArray = (n = BAR_COUNT) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);

// ═════════════════════════════════════════════════════════════════════
//  Component
// ═════════════════════════════════════════════════════════════════════

const AlgorithmVisualizer = () => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedAlgo, setSelectedAlgo] = useState('bubble');
    const [array, setArray] = useState(() => randomArray());
    const [comparing, setComparing] = useState([]);
    const [swapped, setSwapped] = useState([]);
    const [sortedBound, setSortedBound] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [stepCount, setStepCount] = useState(0);
    const [showCode, setShowCode] = useState(false);
    const genRef = useRef(null);
    const runningRef = useRef(false);
    const speedRef = useRef(1);
    const hasAutoPlayedRef = useRef(false);

    useEffect(() => { speedRef.current = speed; }, [speed]);

    const runVisualization = useCallback(async () => {
        if (isDone) return;
        if (!genRef.current) {
            genRef.current = GENERATORS[selectedAlgo](array);
        }
        runningRef.current = true;
        setIsRunning(true);
        const gen = genRef.current;

        const step = () => {
            if (!runningRef.current) return;
            const { value, done } = gen.next();
            if (done || !value) {
                runningRef.current = false;
                setIsRunning(false);
                setIsDone(true);
                setComparing([]);
                setSwapped([]);
                return;
            }
            if (value.done) {
                runningRef.current = false;
                setIsRunning(false);
                setIsDone(true);
                setComparing([]);
                setSwapped([]);
                setArray(value.array);
                return;
            }
            setArray(value.array);
            setComparing(value.comparing || []);
            setSwapped(value.swapped || []);
            setSortedBound(value.sorted ?? -1);
            setStepCount(c => c + 1);
            const delay = Math.max(5, BASE_DELAY / speedRef.current);
            setTimeout(step, delay);
        };
        step();
    }, [selectedAlgo, array, isDone]);


    const reset = useCallback(() => {
        runningRef.current = false;
        setIsRunning(false);
        setIsDone(false);
        setComparing([]);
        setSwapped([]);
        setSortedBound(-1);
        setStepCount(0);
        const newArr = randomArray();
        setArray(newArr);
        genRef.current = null;
    }, []);

    // Intersection observer
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1, rootMargin: '-50px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // ── Logic for Resetting on Scroll ────────────────────────────────────
    useEffect(() => {
        if (!isVisible) {
            // When user scrolls away, we reset the board (gap widens)
            // But we DO NOT reset 'hasAutoPlayedRef' so auto-play only happens once.
            reset();
        } else if (isVisible && !hasAutoPlayedRef.current && !isRunning && !isDone) {
            hasAutoPlayedRef.current = true;
            // First time auto-play with delay for animation
            setTimeout(() => {
                runVisualization();
            }, 1800);
        }
    }, [isVisible, runVisualization, isRunning, isDone, reset]);


    const selectAlgo = useCallback((key) => {
        runningRef.current = false;
        setIsRunning(false);
        setIsDone(false);
        setComparing([]);
        setSwapped([]);
        setSortedBound(-1);
        setStepCount(0);
        setSelectedAlgo(key);
        const newArr = randomArray();
        setArray(newArr);
        genRef.current = null;
    }, []);

    const pause = useCallback(() => {
        runningRef.current = false;
        setIsRunning(false);
    }, []);

    // ── Theme constants ──────────────────────────────────────────────

    const heroColor = '#414eb6';
    const heroColorLight = '#6b7de0';
    const heroColorDark = '#2d3a8c';
    const handwrittenFont = "'StampatelloFaceto', cursive";
    const bodyFont = "'Inter', sans-serif";
    const bg = '#d9d8dd';

    // ── Bar color helper ─────────────────────────────────────────────

    const getBarColor = (index) => {
        if (isDone) return heroColor;
        if (swapped.includes(index)) return heroColorDark;
        if (comparing.includes(index)) return heroColorLight;
        if (selectedAlgo === 'bubble' && sortedBound > 0 && index >= array.length - sortedBound) return heroColorDark;
        if (selectedAlgo === 'selection' && sortedBound >= 0 && index < sortedBound) return heroColorDark;
        if (selectedAlgo === 'heap' && sortedBound > 0 && index >= sortedBound) return heroColorDark;
        return heroColor;
    };

    const maxVal = Math.max(...array, 1);

    return (
        <section
            ref={sectionRef}
            className="algo-viz-section"
            style={{
                padding: '60px 20px 80px',
                background: bg,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.8s ease-out',
            }}
        >
            <style>{`
                @media (max-width: 1440px) and (max-height: 900px) {
                    .algo-viz-section {
                        padding: 40px 16px 60px !important;
                    }
                    .algo-viz-bars {
                        height: 220px !important;
                    }
                    .algo-viz-tab {
                        font-size: 1rem !important;
                        padding: 6px 14px !important;
                    }
                    .algo-viz-btn {
                        font-size: 1.1rem !important;
                    }
                    .algo-viz-desc {
                        font-size: 0.85rem !important;
                    }
                }
                @media (max-height: 768px) {
                    .algo-viz-section {
                        padding: 30px 12px 40px !important;
                    }
                    .algo-viz-bars {
                        height: 180px !important;
                    }
                    .algo-viz-tab {
                        font-size: 0.9rem !important;
                        padding: 5px 12px !important;
                    }
                }
            `}</style>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Bar visualization */}
                <div className="algo-viz-bars" style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: isVisible ? '2px' : '40px',
                    height: '280px',
                    padding: '20px 16px 0',
                    borderBottom: `2px solid ${heroColor}`,
                    marginBottom: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'gap 2s cubic-bezier(0.2, 1, 0.3, 1)',
                }}>
                    {array.map((val, i) => {
                        const heightPct = (val / maxVal) * 100;
                        const barColor = getBarColor(i);
                        const isActive = comparing.includes(i) || swapped.includes(i);
                        return (
                            <div
                                key={i}
                                style={{
                                    width: `${Math.max(100 / array.length - 1, 2)}%`,
                                    height: `${heightPct}%`,
                                    backgroundColor: barColor,
                                    transition: 'height 0.08s ease, background-color 0.15s ease',
                                    borderRadius: '2px 2px 0 0',
                                    position: 'relative',
                                    boxShadow: isActive
                                        ? `0 0 8px ${heroColorLight}88`
                                        : 'none',
                                    flexShrink: 0,
                                }}
                            />
                        );
                    })}
                </div>

                {/* Stats row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 16px',
                    marginBottom: '20px',
                }}>
                    <span style={{
                        fontFamily: handwrittenFont,
                        fontSize: '1.0rem',
                        color: heroColor,
                        opacity: 0.8,
                    }}>
                        {array.length} elements
                    </span>
                    <span style={{
                        fontFamily: handwrittenFont,
                        fontSize: '1.0rem',
                        color: heroColor,
                        opacity: 0.8,
                    }}>
                        {stepCount > 0 ? `${stepCount} steps` : ''}
                    </span>
                </div>

                {/* Controls */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap',
                    paddingBottom: '32px',
                    borderBottom: '1px solid rgba(65, 78, 182, 0.15)'
                }}>
                    {/* Play / Pause */}
                    <button
                        onClick={isRunning ? pause : runVisualization}
                        disabled={isDone && !isRunning}
                        style={{
                            fontFamily: handwrittenFont,
                            fontSize: '1.3rem',
                            background: 'transparent',
                            color: (isDone && !isRunning) ? '#999' : heroColor,
                            border: 'none',
                            borderBottom: (isDone && !isRunning)
                                ? '1px dashed #999'
                                : `2px solid ${heroColor}`,
                            padding: '8px 16px',
                            cursor: (isDone && !isRunning) ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {isRunning ? '❚❚ Pause' : isDone ? '✓ Done' : '▶ Play'}
                    </button>

                    {/* Pseudocode Button */}
                    <button
                        onClick={() => setShowCode(true)}
                        style={{
                            fontFamily: handwrittenFont,
                            fontSize: '1.3rem',
                            background: 'transparent',
                            color: heroColor,
                            border: 'none',
                            borderBottom: `2px solid ${heroColor}`,
                            padding: '8px 16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        ? Pseudocode
                    </button>

                    {/* Reset */}
                    <button
                        onClick={reset}
                        style={{
                            fontFamily: handwrittenFont,
                            fontSize: '1.3rem',
                            background: 'transparent',
                            color: heroColor,
                            border: 'none',
                            borderBottom: `2px solid ${heroColor}`,
                            padding: '8px 16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        ↻ Shuffle
                    </button>

                    {/* Speed control */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <span style={{
                            fontFamily: handwrittenFont,
                            fontSize: '1.1rem',
                            color: heroColor,
                        }}>
                            Speed
                        </span>

                        {/* THEMED SLIDER */}
                        <input
                            type="range"
                            min="0.25"
                            max="5"
                            step="0.25"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="handwritten-slider"
                            style={{
                                width: '100px',
                            }}
                        />

                        <span style={{
                            fontFamily: handwrittenFont,
                            fontSize: '1.0rem',
                            color: heroColor,
                            minWidth: '36px',
                            textAlign: 'center',
                        }}>
                            {speed}×
                        </span>
                    </div>
                </div>

                {/* Algorithm selector tabs */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '32px',
                    marginBottom: '16px',
                    padding: '0',
                }}>
                    {ALGO_LIST.map(algo => (
                        <button
                            key={algo.key}
                            className="algo-viz-tab"
                            onClick={() => selectAlgo(algo.key)}
                            style={{
                                fontFamily: handwrittenFont,
                                fontSize: '1.15rem',
                                background: selectedAlgo === algo.key
                                    ? heroColor
                                    : 'transparent',
                                color: selectedAlgo === algo.key
                                    ? '#fff'
                                    : heroColor,
                                border: `2px solid ${heroColor}`,
                                borderRadius: '0',
                                padding: '8px 18px',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                letterSpacing: '0.04em',
                                whiteSpace: 'nowrap',
                                boxShadow: selectedAlgo === algo.key
                                    ? `3px 3px 0 ${heroColorDark}`
                                    : 'none',
                            }}
                        >
                            {algo.label}
                        </button>
                    ))}
                </div>

                {/* Description */}
                <p className="algo-viz-desc" style={{
                    fontFamily: bodyFont,
                    fontSize: '0.95rem',
                    color: heroColor,
                    textAlign: 'center',
                    marginBottom: '0',
                    opacity: 0.8,
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: 1.5,
                }}>
                    {DESCRIPTIONS[selectedAlgo]}
                </p>

            </div>

            {/* Pseudocode Modal */}
            {showCode && (
                <div
                    onClick={() => setShowCode(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'transparent',
                        backdropFilter: 'blur(5px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            backgroundColor: '#e6e5ea',
                            border: `2px solid ${heroColor}`,
                            borderRadius: '2px',
                            padding: '30px',
                            maxWidth: '600px',
                            width: '90%',
                            boxShadow: `10px 10px 0 ${heroColorDark}40`,
                            position: 'relative',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            animation: 'modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                    >
                        <h3 style={{
                            fontFamily: handwrittenFont,
                            color: heroColor,
                            marginTop: 0,
                            marginBottom: '20px',
                            fontSize: '1.8rem',
                            textAlign: 'center'
                        }}>
                            {ALGO_LIST.find(a => a.key === selectedAlgo).label} Logic
                        </h3>

                        <div style={{
                            fontFamily: handwrittenFont,
                            fontSize: '1.0rem',
                            color: heroColorDark,
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                            letterSpacing: '0.05em'
                        }}>
                            {PSEUDOCODE[selectedAlgo].map((line, idx) => (
                                <div key={idx} style={{
                                    paddingLeft: line.startsWith(' ') ? (line.search(/\S/) * 10) + 'px' : '0px',
                                }}>
                                    {line.trim()}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowCode(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                color: heroColor,
                                cursor: 'pointer',
                                fontFamily: handwrittenFont
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Global/Inline Styles */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── CUSTOM RANGE INPUT STYLING ── */
        .handwritten-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        /* TRACK */
        .handwritten-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 3px;
          background: ${heroColor};
          border-radius: 2px;
          border-bottom: 1px solid ${heroColorDark};
        }

        /* THUMB */
        .handwritten-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid ${heroColor};
          margin-top: -8px;
          box-shadow: 2px 2px 0 ${heroColorDark};
          transition: transform 0.1s ease;
        }

        .handwritten-slider:active::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 1px 1px 0 ${heroColorDark};
        }

        /* FIREFOX */
        .handwritten-slider::-moz-range-track {
          width: 100%;
          height: 3px;
          background: ${heroColor};
          border-radius: 2px;
          border-bottom: 1px solid ${heroColorDark};
        }
        .handwritten-slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid ${heroColor};
          box-shadow: 2px 2px 0 ${heroColorDark};
          cursor: pointer;
        }
      `}</style>
        </section>
    );
};

export default AlgorithmVisualizer;