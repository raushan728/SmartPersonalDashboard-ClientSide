# Smart Personal Dashboard Client

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)

---

## **Description**

The **Smart Personal Dashboard Client** is the frontend application for the Smart Personal Dashboard system.
It provides a modern, responsive user interface for managing tasks, chatting with AI, tracking expenses, scheduling events, and checking weather updates.

- **Backend Repository:** [SmartPersonalDashboard-API](https://github.com/raushan728/SmartPersonalDashboard-API.git)

---

## **Features**

- **User Authentication:** Secure login and registration with JWT tokens
- **Task Management:** Create, edit, delete tasks with file attachments and priority levels
- **AI Chat:** Interactive chat with AI assistant powered by OpenRouter
- **Expense Tracking:** Monitor income and expenses with detailed analytics
- **Calendar Events:** Schedule and manage personal events
- **Weather Information:** Get current weather and forecasts for any city
- **Responsive Design:** Beautiful UI that works on desktop and mobile devices
- **Dark Theme:** Modern dark theme with gradient effects

---

## **Technologies Used**

| Technology         | Description                          |
|--------------------|--------------------------------------|
| **Next.js**       | React framework for production       |
| **React**         | JavaScript library for UI            |
| **TypeScript**    | Typed JavaScript                     |
| **Tailwind CSS**  | Utility-first CSS framework          |
| **shadcn/ui**     | Modern UI components                 |
| **Framer Motion** | Animation library for React          |
| **Lucide React**  | Beautiful icons                      |
| **React Hook Form**| Form handling library               |
| **Zod**           | Schema validation                    |
| **Date-fns**      | Date utility library                 |

---

## **Installation**

Follow these steps to set up the project locally:

### **Prerequisites**
- Node.js (version 18 or higher)
- npm or yarn package manager
- Backend API server running (see [Backend Repository](https://github.com/raushan728/SmartPersonalDashboard-API.git))

### **1. Clone the repository**
```bash
git clone https://github.com/raushan728/SmartPersonalDashboard-ClientSide.git
cd SmartPersonalDashboard-ClientSide
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Start the development server**
```bash
npm run dev
```

The application will be available at **http://localhost:3000**

---

## **Usage**

### **Running the Application**

To run the complete Smart Personal Dashboard system, you need **both backend and frontend servers running simultaneously**:

1. **Start the Backend Server** (from the backend repository):
   ```bash
   cd SmartPersonalDashboard-API
   npm install
   npm start
   ```
   Backend will run on **http://localhost:5000**

2. **Start the Frontend Server** (from this repository):
   ```bash
   cd SmartPersonalDashboard-ClientSide
   npm install
   npm run dev
   ```
   Frontend will run on **http://localhost:3000**

3. **Access the Application:**
   - Open your browser and go to **http://localhost:3000**
   - Register a new account or login with existing credentials
   - Start using the dashboard features

### **Key Features Usage**

- **Dashboard:** Overview of all your activities
- **Tasks:** Manage your to-do list with attachments
- **AI Chat:** Ask questions and get AI-powered responses
- **Expenses:** Track your financial transactions
- **Calendar:** Schedule and view your events
- **Weather:** Check weather conditions for any location

---

## **Project Structure**

```
SmartPersonalDashboard-ClientSide/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   │   ├── ai-chat/       # AI chat page
│   │   ├── calendar/      # Calendar page
│   │   ├── expenses/      # Expenses page
│   │   ├── tasks/         # Tasks page
│   │   ├── weather/       # Weather page
│   │   └── page.tsx       # Main dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── styles/               # Global styles
└── public/               # Static assets
```

---

## **Contributing**

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your fork and create a Pull Request

---

## **Author**

**Raushan Singh**

- [Email](mailto:raushansinghrajpoot687@gmail.com)
- [Twitter](https://twitter.com/Raushan_090)

---

## **License**

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for more details.
