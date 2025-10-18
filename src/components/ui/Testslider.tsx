import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";


type TestSliderProps = {
    randomness: number[];
    setRandomness: React.Dispatch<React.SetStateAction<number[]>>;
  };

export default function TestSlider({ randomness, setRandomness }: TestSliderProps) {
    return (
        <div style={{ width: "100%", padding: "auto",  margin: "0 auto", background: "#f5f5f5" }}>
            <SliderPrimitive.Root
                value={randomness}
                onValueChange={setRandomness}
                max={100}
                step={1}
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <SliderPrimitive.Track
                    style={{
                        position: "relative",
                        flexGrow: 1,
                        height: 8,
                        background: "#e5e7eb",
                        borderRadius: 4,
                    }}
                >
                    <SliderPrimitive.Range
                        style={{
                            position: "absolute",
                            height: "100%",
                            background: "#c89456",
                        }}
                    />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb
                    style={{
                        width: 20,
                        height: 20,
                        background: "#fff",
                        border: "2px solid #c89456",
                        borderRadius: "50%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                    }}
                />
            </SliderPrimitive.Root>
        </div>
    );
}
