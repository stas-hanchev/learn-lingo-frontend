import { createPortal } from 'react-dom'
import css from './Modal.module.css'
import { useEffect } from 'react'

interface ModalProps {
    children: React.ReactNode;
    label: string;
    onClose: () => void;
}

export default function Modal({
    children,
    label,
    onClose,
}: ModalProps) {
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    useEffect(() => {
	  const handleKeyDown = (e: KeyboardEvent) => {
	    if (e.key === "Escape") {
	      onClose();
	    }
	  };
	
	  document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
	
	  return () => {
	    document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
	  };
	}, [onClose]);

    return createPortal(
        <div
            className={css.backdrop}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label={label}
        >
            <div className={css.modal}>
                <button
                    className={css.closeButton}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.body
    )
}
