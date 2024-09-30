// pages/tabs.js
"use client";

import { useState } from "react";

export default function TabsPage() {
  // State to toggle between "Preview" and "Code" tab
  const [activeTab, setActiveTab] = useState("preview");

  // The code to be displayed and copied
  const exampleCode = `
  <div class="alert alert-info">
    This is an example alert using DaisyUI
  </div>
  `;

  // Function to copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleCode.trim());
    alert("Code copied to clipboard!");
  };

  return (
    <div className="container mx-auto p-10">
      {/* <h1 className="text-2xl font-bold mb-6">Component Preview and Code</h1> */}
      
      {/* Tabs for Preview and Code */}
      <div className="tabs">
        <button
          className={`tab tab-bordered ${activeTab === "preview" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
        <button
          className={`tab tab-bordered ${activeTab === "code" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
      </div>

      {/* Tab content based on selected tab */}
      <div className="mt-6">
        {activeTab === "preview" ? (
          <div className="preview p-4 border rounded bg-gray-50">
            <div className="alert alert-info">
              This is an example alert using DaisyUI
            </div>
          </div>
        ) : (
          <div className="code p-4 border rounded bg-gray-100">
            <pre>
              <code>{exampleCode.trim()}</code>
            </pre>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={copyToClipboard}
            >
              Copy Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
