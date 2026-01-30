
import React from 'react';
import Barcode from 'react-barcode';

interface BarcodeStickerSheetProps {
    billId: string;
    patientName: string;
    patientAge: number;
    patientGender: string;
    includeName: boolean;
    includeMeta: boolean;
    count: number;
}

export const BarcodeStickerSheet = React.forwardRef<HTMLDivElement, BarcodeStickerSheetProps>((props, ref) => {
    const { billId, patientName, patientAge, patientGender, includeName, includeMeta, count } = props;
    const shortId = billId.substring(billId.length - 6).toUpperCase();
    
    // Create an array of length 'count' to map over
    const stickers = Array.from({ length: count });

    return (
        <div ref={ref} style={{ 
            padding: '20px', 
            backgroundColor: 'white',
            width: '100%',
        }}>
            {stickers.map((_, index) => (
                <div key={index} style={{ 
                    marginBottom: '20px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    pageBreakInside: 'avoid' 
                }}>
                    <Barcode 
                        value={shortId}
                         height={40} 
                        width={2} 
                        displayValue={true} 
                        fontSize={12} 
                        margin={5}
                    />
                    
                    {includeName && (
                        <div style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', marginTop: '2px' }}>
                            {patientName}
                        </div>
                    )}
                    
                    {includeMeta && (
                        <div style={{ fontSize: '11px', fontFamily: 'Arial, sans-serif' }}>
                            {patientGender} / {patientAge} Years
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
});

BarcodeStickerSheet.displayName = 'BarcodeStickerSheet';
