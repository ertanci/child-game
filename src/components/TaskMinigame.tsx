import React, { useState, useEffect } from 'react';
import { Book, X, Award, CheckCircle2, Globe2 } from 'lucide-react';

interface TaskMinigameProps {
  taskId: string;
  taskName: string;
  taskType: 'english_tf' | 'english_vocab' | 'english_translate';
  onProgress: (increment: number) => void;
  onClose: () => void;
}

const DICT = [
  { en: "Apple", tr: "Elma" }, { en: "Book", tr: "Kitap" }, { en: "Table", tr: "Masa" },
  { en: "Window", tr: "Pencere" }, { en: "Dog", tr: "Köpek" }, { en: "Cat", tr: "Kedi" },
  { en: "Sun", tr: "Güneş" }, { en: "Water", tr: "Su" }, { en: "Fire", tr: "Ateş" },
  { en: "Tree", tr: "Ağaç" }, { en: "House", tr: "Ev" }, { en: "Car", tr: "Araba" },
  { en: "School", tr: "Okul" }, { en: "Pen", tr: "Kalem" }, { en: "Door", tr: "Kapı" }
];

const SENTENCES = [
  { en: "The cat is sleeping.", tr: "Kedi uyuyor.", bad: ["Köpek koşuyor.", "Kuş uçuyor."] },
  { en: "I like apples.", tr: "Elma severim.", bad: ["Armut severim.", "Muz yiyorum."] },
  { en: "Where is the book?", tr: "Kitap nerede?", bad: ["Kalem nerede?", "Kitabım yok."] },
  { en: "It is raining.", tr: "Yağmur yağıyor.", bad: ["Güneş parlıyor.", "Kar yağıyor."] },
  { en: "Open the door.", tr: "Kapıyı aç.", bad: ["Pencereyi kapat.", "Işığı yak."] }
];

export default function TaskMinigame({ taskId, taskName, taskType, onProgress, onClose }: TaskMinigameProps) {
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);

  // States for TF
  const [tfWord, setTfWord] = useState('');
  const [tfMatch, setTfMatch] = useState('');
  const [tfIsTrue, setTfIsTrue] = useState(false);

  // States for Vocab
  const [vocabWord, setVocabWord] = useState('');
  const [vocabOptions, setVocabOptions] = useState<string[]>([]);
  const [vocabAns, setVocabAns] = useState('');

  // States for Translate
  const [transSent, setTransSent] = useState('');
  const [transOptions, setTransOptions] = useState<string[]>([]);
  const [transAns, setTransAns] = useState('');

  useEffect(() => {
    generatePuzzle();
  }, [taskType, step]);

  const generatePuzzle = () => {
    if (taskType === 'english_tf') {
      const isCorrectMatch = Math.random() > 0.5;
      const pair = DICT[Math.floor(Math.random() * DICT.length)];
      setTfWord(pair.en);
      if (isCorrectMatch) {
        setTfMatch(pair.tr);
        setTfIsTrue(true);
      } else {
        let wrong = DICT[Math.floor(Math.random() * DICT.length)];
        while (wrong.tr === pair.tr) wrong = DICT[Math.floor(Math.random() * DICT.length)];
        setTfMatch(wrong.tr);
        setTfIsTrue(false);
      }
    } else if (taskType === 'english_vocab') {
      const correct = DICT[Math.floor(Math.random() * DICT.length)];
      setVocabWord(correct.en);
      setVocabAns(correct.tr);
      
      const opts = [correct.tr];
      while (opts.length < 4) {
        const rand = DICT[Math.floor(Math.random() * DICT.length)].tr;
        if (!opts.includes(rand)) opts.push(rand);
      }
      setVocabOptions(opts.sort(() => Math.random() - 0.5));
    } else if (taskType === 'english_translate') {
      const q = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
      setTransSent(q.en);
      setTransAns(q.tr);
      const opts = [q.tr, ...q.bad].sort(() => Math.random() - 0.5);
      setTransOptions(opts);
    }
  };

  const handleStepComplete = () => {
    onProgress(34);
    if (step >= 2) {
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } else {
      setStep(s => s + 1);
    }
  };

  const checkFail = () => {
    // optional: add a small shake or minus progress, but for kids let's just generate a new one
    generatePuzzle();
  };

  return (
    <div id="minigame_root" className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-4">
      <div className="w-full max-w-md bg-slate-900 border-2 border-indigo-500 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col transform origin-center scale-90 sm:scale-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Globe2 className="text-indigo-400" />
            <h3 className="text-xl font-bold text-indigo-200 tracking-wide">{taskName}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Splash overlay */}
        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 animate-bounce">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-4">
              <Award size={44} className="text-white" />
            </div>
            <p className="text-green-400 text-2xl font-bold tracking-wider">HARİKA ÇEVİRİ!</p>
          </div>
        ) : (
          <div className="flex-1 py-2 flex flex-col">
            
            {/* Steps Progress */}
            <div className="flex gap-2 mb-6 justify-center">
              {[0, 1, 2].map((s) => (
                <div key={s} className={`h-2.5 w-12 rounded-full ${s < step ? 'bg-indigo-500' : 'bg-slate-800'}`} />
              ))}
            </div>

            {/* True/False */}
            {taskType === 'english_tf' && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <p className="text-slate-300 text-sm mb-4">Bu eşleştirme doğru mu?</p>
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
                  <span className="text-2xl font-bold text-amber-300">{tfWord}</span>
                  <span className="text-slate-500 font-black">=</span>
                  <span className="text-2xl font-bold text-emerald-300">{tfMatch}</span>
                </div>
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => { if (tfIsTrue) handleStepComplete(); else checkFail(); }}
                    className="flex-1 py-3 rounded-xl bg-green-600/20 text-green-400 border border-green-500 font-bold active:scale-95 transition cursor-pointer"
                  >
                    DOĞRU ✅
                  </button>
                  <button 
                    onClick={() => { if (!tfIsTrue) handleStepComplete(); else checkFail(); }}
                    className="flex-1 py-3 rounded-xl bg-red-600/20 text-red-400 border border-red-500 font-bold active:scale-95 transition cursor-pointer"
                  >
                    YANLIŞ ❌
                  </button>
                </div>
              </div>
            )}

            {/* Vocab */}
            {taskType === 'english_vocab' && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <p className="text-slate-300 text-sm mb-2">Türkçesini seç:</p>
                <div className="text-3xl font-black text-indigo-400 mb-6 tracking-widest">{vocabWord}</div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {vocabOptions.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => { if (opt === vocabAns) handleStepComplete(); else checkFail(); }}
                      className="py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold transition active:scale-95 cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Translate */}
            {taskType === 'english_translate' && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <p className="text-slate-300 text-sm mb-2">Cümleyi çevir:</p>
                <div className="text-lg font-bold text-sky-300 mb-6 text-center bg-sky-950/40 p-3 rounded-xl border border-sky-800 w-full">
                  "{transSent}"
                </div>
                <div className="space-y-3 w-full">
                  {transOptions.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => { if (opt === transAns) handleStepComplete(); else checkFail(); }}
                      className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium transition active:scale-95 px-4 text-center text-sm cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
