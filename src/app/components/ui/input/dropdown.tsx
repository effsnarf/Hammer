"use client";
import "./dropdown.css";
import Image from "next/image";
import { ReactiveValue } from "@/app/util";
import React from "react";
import { WebImage } from "@/app/types";

interface DropDownProps<T> {
  title: string;
  color?: string;
  icon?: WebImage;
  items: (T | null)[];
  selectedItem: T;
  onSelect: (item: T | null) => void;
  getItemImage?: (item: T | null) => string | null;
  getItemText: (item: T | null) => string;
  hint: string;
}

const DropDown = <T,>({
  title,
  color,
  icon,
  items,
  selectedItem,
  onSelect,
  getItemImage,
  getItemText,
  hint,
}: DropDownProps<T>) => {
  const isVisible = ReactiveValue.from(false);

  const selected = {
    item: ReactiveValue.from(selectedItem),
  };
  selected.item.watch((newItem) => {
    isVisible.set(false);
    onSelect(newItem);
  });

  const dropDownItem = (item: T | null, index: number) => {
    const isEmptyItem = index === -1 && !item;

    if (isEmptyItem) {
      return (
        <li key={index} className={!selected.item.value ? "dimmed" : ""}>
          {hint}
        </li>
      );
    }
    return (
      <li
        className={`flex gap-3 ${!item ? "dimmed justify-center" : ""}`}
        key={index}
        onClick={() => selected.item.set(item)}
      >
        {!getItemImage ? null : !getItemImage(item) ? null : (
          <Image
            className="badge"
            width="40"
            height="40"
            src={getItemImage(item) ?? ""}
            alt="badge"
          />
        )}
        <div>{getItemText(item)}</div>
      </li>
    );
  };

  return (
    <div className="ui-input-dropdown">
      <div className="box1">
        <div className="title flex gap-3" style={{ background: color }}>
          {!icon ? null : (
            <Image
              src={icon.url}
              width={icon.width}
              height={icon.height}
              alt="icon"
            />
          )}
          <div>{title}</div>
        </div>
        <div
          className="hoverable selected"
          onClick={() => isVisible.set(!isVisible.value)}
        >
          <div className="flex justify-between">
            <ul>{dropDownItem(selected.item.value, -1)}</ul>
            <Image
              className={`trans-fast ${isVisible.value ? "rotate-180" : ""}`}
              src="/images/arrow-down.png"
              width="26"
              height="17"
              alt="arrow down"
            />
          </div>
        </div>
        <ul className={`dropdown ${isVisible.value ? "show" : "hide"}`}>
          {items.map((item, index) => dropDownItem(item, index))}
        </ul>
      </div>
    </div>
  );
};

DropDown.displayName = "DropDown";

export default DropDown;
