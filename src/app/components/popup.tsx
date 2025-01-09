import "./popup.css";
import Image from "next/image";
import React, { useImperativeHandle, forwardRef } from "react";
import { Reactive } from "../util";

export interface PopupHandle {
  open: () => void;
  close: () => void;
}

interface PopupProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Popup = forwardRef<PopupHandle, PopupProps>(
  ({ children, onClose }, ref) => {
    const transTime = 0.6;
    const transTimeS = `${transTime}s`;
    let isToggling = false;

    const isOpen = Reactive.value(false);
    const isClosing = Reactive.value(false);

    isOpen.watch(() => {
      isToggling = true;
      setTimeout(() => (isToggling = false), transTime * 1000);
    });
    isOpen.on(false, () => {
      isClosing.set(true);
      setTimeout(() => {
        isClosing.set(false);
        onClose();
      }, transTime * 1000);
    });
    isOpen.blockWhile(() => isToggling);

    const onClickOverlay = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) isOpen.set(false);
    };

    useImperativeHandle(ref, () => ({
      open: () => isOpen.set(true),
      close: () => isOpen.set(false),
    }));

    return (
      <div
        className={`popup ${isOpen.value ? "open" : null} ${isClosing.value ? "closing" : null}`}
        onClick={onClickOverlay}
        style={{ transition: transTimeS }}
      >
        <div className="window" style={{ transition: transTimeS }}>
          <div className="buttons">
            <Image
              className="clickable"
              src="/images/x.png"
              width="14"
              height="14"
              alt="close"
              onClick={() => isOpen.set(false)}
            />
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    );
  }
);

Popup.displayName = "Popup";

export default Popup;
