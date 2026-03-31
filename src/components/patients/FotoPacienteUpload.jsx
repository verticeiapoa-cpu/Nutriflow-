import { useRef } from "react";
import { Camera } from "lucide-react";

export default function FotoPacienteUpload({ foto, onChange }) {
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  const initials = "?";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center cursor-pointer"
        onClick={() => inputRef.current?.click()}>
        {foto ? (
          <img src={foto} alt="Foto" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-2xl font-bold">{initials}</span>
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => inputRef.current?.click()}
          className="text-xs text-green-600 hover:text-green-800 font-medium">
          {foto ? "Trocar" : "Adicionar foto"}
        </button>
        {foto && (
          <button type="button" onClick={() => onChange("")}
            className="text-xs text-red-400 hover:text-red-600">
            Remover
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}
