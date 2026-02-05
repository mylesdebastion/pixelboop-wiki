import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import styles from './styles.module.css';
import { ArrowRight, Construction, ArrowLeft, List } from '@carbon/icons-react';
import TextTransition from "./TextTransition";
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import { useActiveVersion } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, { translate } from '@docusaurus/Translate';


type position = [number | "t" | "u" | "c", number?];
type dimension = [number, number] | number;

// interface colorElement{
//     origin: position;
//     color: string | string[];
//     type: "single" | "array" | "area" | "area-array";

//     pos: position | position[] | [position, dimension] | [position, dimension][]; // For single and array

//     // By default, the position in uiElement is used, unless specified here as the new origin
//     // For single, only color is needed - This is the default!
//     // For array, single color and array of pos is needed
//     // For area, single color and size is needed
//     // For area-array, size is needed and color is an array of colors, colors element can be undefined!
//   }
interface uiDisplayElement {
    pos: position;
    size?: dimension;
    color?: string | string[];
}

interface uiElement
{
    // Functions
    name?: string; // If no name, only color will be displayed
    desc?: string;
    link?: string;
    elements: uiDisplayElement[];
}

interface UIProps {
  uiName: string;
  uiDescription: string;
  uiElements: uiElement[];
  uiParentLink?: string;
}

const MystrixVisualizer: React.FC<UIProps> = ({ uiName, uiDescription, uiElements, uiParentLink }) => {
    const activeVersion = useActiveVersion();
    const { siteConfig } = useDocusaurusContext();
    const [selected_function, setSelectedFunction] = useState<number | undefined>(undefined);
    const [selected_function_locked, setSelectedFunctionLocked] = useState<boolean>(false);

    // 44 * 24 = 1056 keys
    const GRID_WIDTH = 44;
    const GRID_HEIGHT = 24;
    const TOTAL_KEYS = GRID_WIDTH * GRID_HEIGHT;

    const [keypadColors, setKeypadColors] = useState<(string | undefined)[]>(Array(TOTAL_KEYS).fill(undefined));
    const [keypadFunctions, setKeypadFunctions] = useState<(number | undefined)[]>(Array(TOTAL_KEYS).fill(undefined));
    const [keypadFunctionStacks, setKeypadFunctionStacks] = useState<number[][]>(
        () => Array.from({ length: TOTAL_KEYS }, () => [])
    );
    
    // Removed Matrix-specific hardware features (underglow, touchbar, center key)
    const [detailButtonColor, setDetailButtonColor] = useState<string>("unset");
    const [displayedName, setDisplayedName] = useState<string>(uiName);
    const [displayedDesc, setDisplayedDesc] = useState<string>(uiDescription);
    const [isBackButtonHovered, setIsBackButtonHovered] = useState<boolean>(false);
    const [isListButtonHovered, setIsListButtonHovered] = useState<boolean>(false);
    const [isListViewOpen, setIsListViewOpen] = useState<boolean>(false);

    // Helper function to resolve version-aware links
    const resolveLink = useCallback((link: string) => {
        if (!link || link.startsWith('#')) return link;

        // If link starts with /docs, prepend version path
        if (link.startsWith('/docs') && activeVersion) {
            return `${activeVersion.path}${link.substring(5)}`; // Remove '/docs' and prepend version path
        }

        return link;
    }, [activeVersion]);

    const getKeyID = (x: number, y: number) => x + y * GRID_WIDTH;

    const constructor = () => {
        const tempKeypadColors: (string | undefined)[] = Array(TOTAL_KEYS).fill(undefined);
        const tempKeypadFunctions: (number | undefined)[] = Array(TOTAL_KEYS).fill(undefined);
        const tempKeypadFunctionStacks: number[][] = Array.from({ length: TOTAL_KEYS }, () => []);

        uiElements.forEach((element, index) => {
            if(element.elements === undefined) return;

            element.elements?.forEach((displayElement) => {
                // PixelBoop only uses main grid elements
                if (displayElement.pos[0] === "t" || displayElement.pos[0] === "u" || displayElement.pos[0] === "c") {
                    return; // Skip Touchbar, Underglow, CenterKey
                } else {
                    if (!displayElement.size) displayElement.size = [1, 1];

                    if (!Array.isArray(displayElement.size)) { return; }
                    
                    if (Array.isArray(displayElement.color) && displayElement.color.length !== displayElement.size[0] * displayElement.size[1]) { return; }

                    for (let x = 0; x < displayElement.size[0]; x++) {
                        for (let y = 0; y < displayElement.size[1]; y++) {
                            const keyID = getKeyID(displayElement.pos[0] as number + x, displayElement.pos[1] + y);
                            if (keyID >= TOTAL_KEYS) continue; // Safety check

                            tempKeypadFunctions[keyID] = index;
                            if (!tempKeypadFunctionStacks[keyID].includes(index)) {
                                tempKeypadFunctionStacks[keyID].push(index);
                            }
                            if (typeof displayElement.color === "string" || displayElement.color === undefined) {
                                tempKeypadColors[keyID] = displayElement.color;
                            }
                            else if(Array.isArray(displayElement.color))
                            {
                                tempKeypadColors[keyID] = displayElement.color[y * displayElement.size[0] + x];
                            }
                        }
                    }
                }
            });
        });

        setKeypadColors(tempKeypadColors);
        setKeypadFunctions(tempKeypadFunctions);
        setKeypadFunctionStacks(tempKeypadFunctionStacks);
    };

    const selectHighlightFunction = useCallback((function_id: number, color : string = "rgb(60, 60, 60)") => {
        if (selected_function_locked == false && function_id != undefined)
        {
            setSelectedFunction(function_id);
            // console.log("Select Function ID: " + function_id);
            if (uiElements[function_id].link != undefined) {
                setDetailButtonColor(color);
            }
        }
        else if (selected_function_locked == false && function_id == undefined)
        {
            setSelectedFunction(undefined);
        }
    }, [selected_function_locked, uiElements]);

    const lockSelectedFunction = useCallback((function_id: number, color : string = "rgb(60, 60, 60)") => {
        // console.log("Lock Function ID: " + function_id);
        if (selected_function_locked == true && selected_function == function_id) {
            setSelectedFunctionLocked(false);
            setSelectedFunction(undefined);
        }
        else if (uiElements[function_id] != undefined && uiElements[function_id].name != undefined) {
            setSelectedFunctionLocked(true);
            setSelectedFunction(function_id);
            if (uiElements[function_id].link != undefined) {
                setDetailButtonColor(color);
            }
        }
        else
        {
            setSelectedFunctionLocked(false);
            setSelectedFunction(undefined);
        }
    }, [selected_function_locked, selected_function, uiElements]);

    useEffect(() => {
        constructor();
    }, [uiElements]);

    useEffect(() => {
        const newName = selected_function !== undefined && uiElements[selected_function]?.name !== undefined
            ? uiElements[selected_function].name
            : uiName;
        const newDesc = selected_function !== undefined && uiElements[selected_function]?.name !== undefined
            ? (uiElements[selected_function].desc !== undefined ? uiElements[selected_function].desc : "")
            : uiDescription;

        setDisplayedName(newName);
        setDisplayedDesc(newDesc);
    }, [selected_function, uiName, uiDescription]);

  return (
    <ErrorBoundary
        fallback={({error, tryAgain}) => (
        <div>
            <p>The PixelBoop Visualizer crashed because of error: {error.message}.</p>
            <button onClick={tryAgain}>Try Again!</button>
        </div>
        )}>
        <div className={styles.MystrixVisualizer} >
            <div className={styles.topBar}>
                <div className={styles.topBarSection}>
                    {uiParentLink && (
                        <button
                            className={styles.topBarButton}
                            onMouseEnter={() => setIsBackButtonHovered(true)}
                            onMouseLeave={() => setIsBackButtonHovered(false)}
                            onClick={() => window.open(resolveLink(uiParentLink), "_self")}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                </div>
                <div className={styles.topBarTitle}>
                    <TextTransition springConfig={{ tension: 200, friction: 22 }} inline={false} style={{ width: '100%', textAlign: 'center' }}>
                        {isBackButtonHovered ? translate({
                            message: 'Go Back to Parent UI',
                            id: 'mystrixVisualizer.goBack',
                            description: 'Tooltip text for back button in Mystrix Visualizer'
                        }) : isListButtonHovered ? translate({
                            message: 'List All Available Controls',
                            id: 'mystrixVisualizer.listControls',
                            description: 'Tooltip text for list button in Mystrix Visualizer'
                        }) : uiName}
                    </TextTransition>
                </div>
                <div className={styles.topBarSection}>
                    <button
                        className={`${styles.topBarButton} ${isListViewOpen ? styles.topBarButtonActive : ''}`}
                        onMouseEnter={() => setIsListButtonHovered(true)}
                        onMouseLeave={() => setIsListButtonHovered(false)}
                        onClick={() => setIsListViewOpen(!isListViewOpen)}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            <div className={styles.mystrixContent} onClick={() => {lockSelectedFunction(undefined)}}>
            <div className={styles.mystrix}>
                {/* Removed Underglow */}
                
                <div className={styles.mystrixBorder} onMouseLeave={() => {selectHighlightFunction(undefined)}}>
                    <div className={styles.mystrixControls}>
                    {Array.from({ length: GRID_HEIGHT }, (_, y) => (
                        <div key={y} className={styles.mystrixControlsRow}>
                        {Array.from({ length: GRID_WIDTH }, (_, x) => {
                            let keyColor = keypadColors?.[y * GRID_WIDTH + x];
                            const keyID = y * GRID_WIDTH + x;
                            const keyFunctions = keypadFunctionStacks?.[keyID] ?? [];
                            const isSelected = selected_function != undefined && keyFunctions.includes(selected_function);
                            let dim = false; // Disabled dimming behavior - keep all pixels at full brightness
                            let selected = isSelected;

                            return ( 
                                <div 
                                    key={x} 
                                    className={`
                                        ${styles.mystrixBtn} 
                                        ${keyColor ? styles.mystrixBtnLit : ''} 
                                        ${dim ? styles.mystrixBtnDim : ''} 
                                        ${selected ? styles.mystrixBtnSelected : ''}`}
                                    style={{ 
                                        // clipPath: getCornerRadius(x, y), // Removed custom shapes
                                        backgroundColor: keyColor ? keyColor : "rgb(50, 50, 50)",
                                        // boxShadow: (keyColor && ! dim) ? `0 0 5px 1px ${keyColor}` : "none", // Removed glow for clarity
                                        }}
                                    onMouseEnter={(e) => { selectHighlightFunction(keypadFunctions[keyID], keyColor);}}
                                    onClick={(e) => { lockSelectedFunction(keypadFunctions[keyID], keyColor);  e.stopPropagation()}}
                                    />
                            );
                        })}
                        </div>
                    ))}
                    </div>
                </div>

                {/* Removed TouchKeys and CenterKey */}
            
            </div>
            <FunctionDisplaySection
                displayedName={displayedName}
                displayedDesc={displayedDesc}
                selected_function={selected_function}
                uiElements={uiElements}
                detailButtonColor={detailButtonColor}
                isListViewOpen={isListViewOpen}
                lockSelectedFunction={lockSelectedFunction}
                setIsListViewOpen={setIsListViewOpen}
                selectHighlightFunction={selectHighlightFunction}
                keypadFunctions={keypadFunctions}
                keypadColors={keypadColors}
                resolveLink={resolveLink}
            />
            </div>
        </div>
    </ErrorBoundary>
  );
};

// Memoized component to prevent unnecessary re-renders
const FunctionDisplaySection = memo(({
    displayedName,
    displayedDesc,
    selected_function,
    uiElements,
    detailButtonColor,
    isListViewOpen,
    lockSelectedFunction,
    setIsListViewOpen,
    selectHighlightFunction,
    keypadFunctions,
    keypadColors,
    resolveLink
}: {
    displayedName: string;
    displayedDesc: string;
    selected_function: number | undefined;
    uiElements: uiElement[];
    detailButtonColor: string;
    isListViewOpen: boolean;
    lockSelectedFunction: (function_id: number, color?: string) => void;
    setIsListViewOpen: (open: boolean) => void;
    selectHighlightFunction: (function_id: number, color?: string) => void;
    keypadFunctions: (number | undefined)[];
    keypadColors: (string | undefined)[];
    resolveLink: (link: string) => string;
}) => {
    const content = useMemo(() => (
        <div className={styles.functionDisplayContent}>
            <div className={styles.functionNameWrapper}>
                <h2 className={styles.functionName}>
                    {displayedName}
                </h2>
            </div>
            <div className={styles.functionDesc}>
                {displayedDesc}
            </div>
        </div>
    ), [displayedName, displayedDesc]);

    return (
        <div className={styles.functionDisplay}>
            <div className={styles.functionDisplayWrapper}>
                <TextTransition springConfig={{ tension: 150, friction: 24 }} direction="left">
                    {content}
                </TextTransition>
            </div>
            <button
                className={`${styles.functionDetailBtn} ${(selected_function !== undefined && uiElements[selected_function].link !== undefined) ?  '' : styles.functionDetailBtnHidden}`}
                style={{
                    backgroundColor: detailButtonColor
                }}
                onClick={() => {
                    if (selected_function !== undefined && uiElements[selected_function].link !== undefined)
                    {
                        const link = uiElements[selected_function].link;
                        if(link.startsWith("#"))
                        {
                            window.location.hash = "";
                            window.location.hash = link;
                        }
                        else
                        {
                            window.open(resolveLink(link), "_self");
                        }
                    }
                }}
            >
                <div className={styles.functionDetailBtnContent} style={{color: detailButtonColor}}>
                    <div className={styles.functionDetailBtnText}>
                        <Translate id="mystrixVisualizer.details" description="Button text for details button in Mystrix Visualizer">
                            DETAILS
                        </Translate>
                    </div>
                    <ArrowRight size={28} className={styles.functionDetailBtnArrow}/>
                </div>
            </button>
            <div className={`${styles.elementsList} ${isListViewOpen ? styles.elementsListOpen : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.elementsListContent}>
                    {uiElements.map((element, index) => (
                        element.name && (
                            <div
                                key={index}
                                className={styles.elementsListItem}
                                onMouseEnter={() => selectHighlightFunction(index)}
                                onMouseLeave={() => selectHighlightFunction(undefined)}
                                onClick={(e) => {
                                    const keyID = keypadFunctions.findIndex(funcId => funcId === index);
                                    const color = keyID !== -1 ? keypadColors[keyID] : undefined;
                                    lockSelectedFunction(index, color);
                                    setIsListViewOpen(false);
                                    e.stopPropagation();
                                }}
                            >
                                <div className={styles.elementsListItemName}>{element.name}</div>
                                {element.desc && <div className={styles.elementsListItemDesc}>{element.desc}</div>}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
});

export default MystrixVisualizer;
