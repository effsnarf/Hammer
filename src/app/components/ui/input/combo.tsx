"use client";
import { ReactiveValue } from '@/app/util';
import './combo.css';
import React, { useState, useEffect } from 'react';

interface UiInputComboProps {
    title: string,
    color?: string,
    icon?: string,
    items: any[];
    selectedItem: ReactiveValue<any>;
    onSelect: (item: any) => void;
    getItemImage?: (item: any) => string;
    getItemText: (item: any) => string;
    hint: string
}
  
const UiInputCombo: React.FC<UiInputComboProps> = ({ title, color, icon, items, selectedItem, onSelect, getItemImage, getItemText, hint }) => {
    const isVisible = ReactiveValue.from(false);

    const selected = {
        item: ReactiveValue.from(selectedItem),
    }
    selected.item.watch((newItem) => {
        isVisible.set(false);
        onSelect(newItem);
    });
        
    const dropDownItem = (item: any, index: number) => {
        return (
            (!item) ? <li key={index} className={(!selected.item.value ? 'dimmed' : '')}>{hint}</li> :
        <li className="flex gap-3" key={index} onClick={() => selected.item.set(item)}>
            {(!getItemImage) ? null : <img className='badge' src={getItemImage(item)} />}
            <div>{getItemText(item)}</div>
        </li>);
    }
    
  return (
    <div className="ui-input-combo">
      <div className="box1">
        <div className="title flex gap-3" style={{ background: color }}>
            <img src={icon} />
            <div>{title}</div>
        </div>
        <div className="hoverable selected" onClick={() => isVisible.set(!isVisible.value)}>
            <div className="flex justify-between">
                <ul>
                    {dropDownItem(selected.item.value, -1)}
                </ul>
                <img className={`trans-fast ${(isVisible.value ? 'rotate-180' : '')}`} src="/images/arrow-down.png" />
            </div>
        </div>
        <ul className={`dropdown ${isVisible.value ? 'show' : 'hide'}`}>
          {items.map((item, index) => dropDownItem(item, index))}
        </ul>
      </div>
    </div>
  );
};

export default UiInputCombo;
