# FraudGuard AI

## 📌 Overview

**FraudGuard AI** is a full-stack fintech cybersecurity platform designed to detect, analyze, and visualize suspicious financial transactions in real time. The platform combines secure backend infrastructure, interactive analytics dashboards, and a machine learning-ready fraud detection pipeline to help identify fraudulent activity efficiently.

The project is built using:

* **Frontend:** HTML5, CSS3, JavaScript, Chart.js
* **Backend:** Django
* **Database:** SQLite
* **Machine Learning:** Random Forest Classifier

---

# 🚀 Features

## 🔐 Secure Authentication

* Django-based login/logout system
* Restricted dashboard access
* Protected administrative controls

## 📂 Batch CSV Upload System

* Upload and process large transaction datasets
* Automatic validation and database synchronization
* Efficient row-by-row ingestion pipeline

## 📊 Interactive Analytics Dashboard

* Real-time fraud monitoring
* Dynamic charts using Chart.js
* Fraud trend visualization
* Suspicious transaction tracking

## 🤖 AI Fraud Detection Pipeline

* Machine learning-ready architecture
* Random Forest-based fraud scoring system
* Detection of abnormal transaction behavior

## ⚡ Real-Time Metrics

Dashboard statistics include:

* Total Transactions Scanned
* High-Risk Alerts
* Fraudulent Transaction Ratio
* Estimated Fraud Capital Prevented

---

# 🏗️ System Architecture

```text
[ Frontend: HTML/CSS/JS ]
            ↕
[ Django Backend Framework ]
            ↕
[ SQLite Database ]
            ↕
[ ML Layer: Random Forest ]
```

---

# 🖥️ Tech Stack

| Technology   | Purpose                      |
| ------------ | ---------------------------- |
| HTML5/CSS3   | Frontend Structure & Styling |
| JavaScript   | Dynamic Frontend Logic       |
| Chart.js     | Data Visualization           |
| Django       | Backend Framework            |
| SQLite       | Database                     |
| Python       | Backend & ML                 |
| Scikit-learn | Random Forest Model          |

---

# 📂 Project Structure

```text
AI_Model_for_Flagging_Suspicious_Transaction/
├── .env                              # Environment variables configuration
├── dataset.csv                       # Project-wide raw transactions dataset
├── db.sqlite3                        # SQLite local database
├── manage.py                         # Django management script
├── poster.html                       # HTML project poster/presentation file
├── requirements.txt                  # Python dependencies
├── test_model.py                     # Independent script to test prediction engine
├── fraud_detection_system/           # Main Django project configuration directory
│   ├── __init__.py
│   ├── settings.py                   # Django project settings
│   ├── urls.py                       # Global URL routing
│   └── wsgi.py                       # WSGI entry-point for servers
└── transactions/                     # Main Django application directory
    ├── __init__.py
    ├── admin.py                      # Django admin configuration
    ├── apps.py                       # App configuration metadata
    ├── models.py                     # Database models (Transaction, Profile, etc.)
    ├── tests.py                      # Unit tests
    ├── urls.py                       # Application-specific URL routing
    ├── views.py                      # Application views & API endpoint logic
    ├── migrations/                   # Database migrations directory
    │   ├── 0001_initial.py
    │   └── __init__.py
    ├── ml_engine/                    # Machine Learning engine
    │   ├── __init__.py
    │   ├── dataset.csv               # Local copy of the dataset for training
    │   ├── model_v1.pkl              # Serialized trained model (Pickle format)
    │   ├── predictor.py              # Logic to load model and predict status
    │   ├── retrain_model.py          # Script to retrain/update model
    │   └── train_model.py            # Initial training pipeline script
    ├── static/                       # Static assets
    │   └── transactions/
    │       ├── css/
    │       │   ├── dashboard.css     # Dashboard UI styles
    │       │   ├── style.css         # Common/global styles
    │       │   └── webpage.css       # Main landing page styles
    │       └── js/
    │           ├── auth.js           # Authentication handler scripts
    │           ├── dashboard.js      # Dashboard dynamic features and charts
    │           ├── script.js         # Common utility scripts
    │           └── webpage.js        # Main landing page animations/logic
    └── templates/                    # HTML templates
        ├── registration/
        │   ├── login.html            # User login page
        │   └── signup.html           # User signup/registration page
        └── transactions/
            ├── base.html             # Base layout template
            ├── dashboard.html        # Main analytics & transaction dashboard
            └── webpage.html          # Public landing/presentation page

```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/FraudGuard-AI.git
cd FraudGuard-AI
```

---

## 2️⃣ Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux/Mac

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Run Migrations

```bash
python manage.py migrate
```

---

## 5️⃣ Start Development Server

```bash
python manage.py runserver
```

Open in browser:

```text
http://127.0.0.1:8000
```

---

# 📊 CSV Dataset Format

Example transaction dataset format:

```csv
Transaction_ID,Amount,Location,Time,Location_Code,AI_Score,Target
TXN1001,12000,Delhi,02:30,IND01,0.92,1
TXN1002,500,Mumbai,13:15,IND02,0.12,0
```

---

# 🤖 Machine Learning Workflow

1. Upload historical transaction dataset
2. Preprocess transaction records
3. Train Random Forest model
4. Generate `fraud_model.pkl`
5. Integrate model for live predictions
6. Display fraud scores on dashboard

---

# 🛠️ Challenges Solved

* Fixed database field-mapping mismatches
* Optimized CSV batch ingestion pipeline
* Prevented chart overlapping using `chart.destroy()`
* Resolved Python virtual environment conflicts
* Improved dashboard synchronization performance

---

# 🔮 Future Enhancements

* REST API integration
* Real-time fraud alerts
* WebSocket live monitoring
* Geo-location fraud heatmaps
* Explainable AI risk scoring
* PostgreSQL migration for scalability

---

# 📸 Dashboard Highlights

* Glassmorphic cybersecurity UI
* Interactive Doughnut Charts
* Transaction Trend Graphs
* Fraud Analytics Panels
* Real-Time Risk Metrics

---

# 👨‍💻 Author

Developed by **Tushar Singh Rathore**

---

# 📜 License

This project is developed for educational and research purposes.
