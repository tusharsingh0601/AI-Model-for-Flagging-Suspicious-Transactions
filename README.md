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
FraudGuard-AI/
│
├── fraudguard/
│   ├── settings.py
│   ├── urls.py
│
├── dashboard/
│   ├── models.py
│   ├── views.py
│   ├── templates/
│   ├── static/
│
├── uploads/
├── ml_model/
│   ├── train_model.py
│   ├── fraud_model.pkl
│
├── db.sqlite3
├── manage.py
└── requirements.txt
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
