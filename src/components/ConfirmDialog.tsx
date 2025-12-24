"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      {/* Click on modal prevents closing */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            onClick={onCancel}
            className="modal-close"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">{message}</div>

        {/* Modal Footer with Actions */}
        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-secondary btn-block">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${
              isDangerous ? "btn-danger" : "btn-primary"
            } btn-block`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
