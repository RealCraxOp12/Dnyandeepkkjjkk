"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { importStudents } from "@/app/actions/student";

export function BulkStudentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      parseExcel(selected);
      setUploadResult(null);
    }
  };

  const parseExcel = (file: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setParsedData(jsonData);
      } catch (error) {
        console.error("Error parsing Excel:", error);
        setUploadResult({ success: false, error: "Failed to parse the Excel file. Please ensure it's a valid .xlsx or .csv format." });
      } finally {
        setIsParsing(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const result = await importStudents(parsedData);
      setUploadResult(result);
      if (result.success) {
        setFile(null);
        setParsedData([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error: any) {
      setUploadResult({ success: false, error: error.message || "An unexpected error occurred during upload." });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-green-600" /> Bulk Excel Upload
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload an Excel (.xlsx) or CSV file to import multiple students at once. Ensure your column headers match the database fields (e.g. firstName, surname, adharNo).
        </p>
      </div>

      {!file && !uploadResult?.success && (
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <Upload className="w-10 h-10 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Click to upload Excel sheet</h3>
          <p className="text-sm text-slate-500 mt-2">Supports .xlsx, .xls, and .csv files</p>
        </div>
      )}

      {isParsing && (
        <div className="flex flex-col items-center justify-center p-8 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-500" />
          <p>Parsing Excel file...</p>
        </div>
      )}

      {file && !isParsing && parsedData.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">{file.name}</h3>
              <p className="text-sm text-slate-500">Found {parsedData.length} student records ready to import.</p>
            </div>
            <button 
              onClick={() => { setFile(null); setParsedData([]); }}
              className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancel
            </button>
          </div>
          
          <button
            onClick={handleImport}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
            {isUploading ? 'Importing Students...' : `Confirm & Import ${parsedData.length} Students`}
          </button>
        </div>
      )}

      {uploadResult && (
        <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 ${uploadResult.success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900'}`}>
          {uploadResult.success ? (
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-semibold">{uploadResult.success ? 'Import Successful' : 'Import Failed'}</h4>
            <p className="text-sm mt-1">{uploadResult.success ? uploadResult.message : uploadResult.error}</p>
          </div>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx, .xls, .csv" 
        className="hidden" 
      />
    </div>
  );
}
