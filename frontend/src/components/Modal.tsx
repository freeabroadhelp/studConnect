import React, { useEffect } from 'react';

interface ModalProps { open:boolean; onClose:()=>void; title?:string; children:React.ReactNode; width?:string }

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, width }) => {
	useEffect(() => {
		function esc(e:KeyboardEvent){ if(e.key==='Escape') onClose(); }
		if(open) document.addEventListener('keydown', esc);
		return () => document.removeEventListener('keydown', esc);
	}, [open, onClose]);
	if(!open) return null;
	return (
		<div className="modal__overlay" role="dialog" aria-modal="true" onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
			<div className="modal" style={{width: width || 'min(560px,90%)'}}>
				<div className="modal__header">
					<h3>{title}</h3>
					<button className="modal__close" onClick={onClose} aria-label="Close">×</button>
				</div>
				<div className="modal__body">{children}</div>
			</div>
		</div>
	);
};
