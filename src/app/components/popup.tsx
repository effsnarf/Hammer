import "./popup.css";
import React, { useImperativeHandle, forwardRef } from "react";
import { ReactiveValue } from "../util";

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

    const isOpen = ReactiveValue.from(false);
    const isClosing = ReactiveValue.from(false);

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
            <img
              className="clickable"
              src="/images/x.png"
              alt="Close"
              onClick={() => isOpen.set(false)}
            />
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    );
  }
);

export default Popup;
