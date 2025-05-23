# **CodeAssist IDE**

CodeAssist IDE is a **web-based development platform** that integrates AI assistance to enhance prompts and provide development architecture guidance. Inspired by modern IDEs like Replit and VS Code, it combines an interactive AI chat assistant with a feature-rich IDE to deliver a seamless and efficient coding experience.

---

## **Features**

### 🎯 **Integrated AI Assistant**
- **ChatGPT**: Improves prompts and assists in debugging.  
- **Claude**: Offers architectural insights and project structure guidance.  
- Context-aware responses tailored to the active file or issue.

### 💻 **Functional IDE**
- **File Management**: Supports multiple files and organized folder structures.  
- **Syntax Highlighting**: For JavaScript, Python, and other popular languages.  
- **Integrated Console**: Displays real-time output and error logs.

### 🛠️ **Debugging and Error Handling**
- Simplified error interpretation with actionable suggestions.  
- Assistance to improve code quality and fix common issues.

### 🌐 **Ready-to-Use Base Model**
- Fully functional without requiring API keys.  
- Placeholder configurations allow easy integration of ChatGPT and Claude APIs.

---

## **Design Overview**

- **Colors**:  
  - Primary: Royal Blue (`#0066CC`)  
  - Secondary: Dark Blue (`#003366`)  
  - Background: Light Blue (`#F5F9FF`)  
  - Text: Near Black (`#1A1A1A`)  
  - Accent: Bright Blue (`#4DA3FF`)  

- **Typography**:  
  - **SF Pro Display** for headings.  
  - **JetBrains Mono** for code and IDE elements.  

- **Layout**:  
  - Split-pane layout with collapsible panels for improved navigation.  
  - Modern flat design with subtle shadows.  
  - Spacing: 16px for consistent padding and margins.  
  - Dark mode support.

---

## **How to Use**

### 1️⃣ **Installation**
1. Clone this repository to your local environment:
   ```bash
   git clone https://github.com/your-repo/codeassist-ide.git
   ```
2. Navigate to the project directory:
   ```bash
   cd codeassist-ide
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### 2️⃣ **Running the Project**
Start the development server:
```bash
npm start
```
The application will be accessible at `http://localhost:3000`.

### 3️⃣ **Using AI Assistance**
- By default, the platform uses placeholder configurations for ChatGPT and Claude APIs.
- To integrate your API keys, edit the `config.js` file:
  ```javascript
  export const API_KEYS = {
      CHATGPT: "your-chatgpt-api-key",
      CLAUDE: "your-claude-api-key"
  };
  ```

### 4️⃣ **Building for Production**
To build the project for production, run:
```bash
npm run build
```

---

## **Contributing**

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## **Development**
This project was created by Swytchz and Shox for Wisefy Solutions.


## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.
