# Student Performance Dashboard

🎓 **A comprehensive web application for analyzing cognitive skills and student performance using machine learning and interactive data visualizations.**

[![Next.js](https://img.shields.io/badge/Next.js-15.0.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.8.0-22d3ee?style=flat-square)](https://recharts.org/)

## 🌟 Live Demo

**🚀 [View Live Application](https://student-performance-dashboard-iota.vercel.app/)** *(Deploy Soon)*

## ✨ Key Features

### 📊 **CSV Data Upload**
- **Drag & Drop Interface**: Easy file upload with validation
- **Sample Data**: Download template CSV for proper formatting  
- **Real-time Processing**: Instant analytics generation after upload
- **Error Handling**: Clear feedback for invalid files

### 🧠 **Machine Learning Analysis**
- **Performance Prediction**: Linear regression model for assessment score prediction
- **Student Clustering**: K-means algorithm identifying 4 distinct learning personas
- **Feature Importance**: Understanding which cognitive skills drive performance
- **Model Metrics**: R² score and accuracy measurements

### 📈 **Interactive Visualizations**
- **Bar Charts**: Class performance comparisons
- **Scatter Plots**: Correlation analysis between skills and performance
- **Radar Charts**: Individual student cognitive profiles
- **Pie Charts**: Performance distribution across student population
- **Responsive Design**: Works seamlessly on all devices

### 📋 **Comprehensive Analytics**
- **Overview Dashboard**: Key performance metrics at a glance
- **Student Database**: Searchable, sortable, and filterable student records
- **Learning Personas**: AI-identified student groups with unique characteristics
- **Actionable Insights**: Data-driven recommendations for improvement

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Bharadwaj204/Student-Performance-Dashboard.git
cd Student-Performance-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run start
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.0.2, React 18, TypeScript
- **Styling**: Tailwind CSS 3.3.0
- **Charts**: Recharts 2.8.0
- **Icons**: Lucide React
- **Machine Learning**: Custom TypeScript implementation
- **Data Processing**: CSV parsing and validation

## 📊 CSV Data Format

Your CSV file must contain these columns:

| Column | Description | Range |
|--------|-------------|-------|
| `student_id` | Unique identifier | e.g., STU0001 |
| `name` | Student full name | Any string |
| `class` | Academic class/subject | Any string |
| `comprehension` | Reading & understanding | 0-100 |
| `attention` | Focus ability | 0-100 |
| `focus` | Concentration capability | 0-100 |
| `retention` | Memory & recall | 0-100 |
| `assessment_score` | Academic performance | 0-100 |
| `engagement_time` | Daily study time (minutes) | 30-300 |

## 📁 Project Structure

```
student-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── FileUpload.tsx      # CSV upload interface
│   │   ├── Charts.tsx          # Data visualizations
│   │   ├── StudentTable.tsx    # Data table
│   │   ├── StatsCard.tsx       # Statistics cards
│   │   └── InsightsSection.tsx # AI insights
│   ├── lib/                    # Utilities
│   │   ├── mlModels.ts         # ML algorithms
│   │   └── utils.ts            # Helper functions
│   └── data/                   # Data utilities
│       └── generateStudentData.ts # Data types
├── analysis/                   # Jupyter notebook
│   └── student_performance_analysis.ipynb
├── public/                     # Static assets
│   └── sample_student_data.csv # Sample CSV file
└── package.json               # Dependencies
```

## 🎯 How It Works

1. **Upload CSV**: Users upload their student data via drag & drop interface
2. **Data Validation**: System validates CSV structure and data types
3. **ML Processing**: Algorithms analyze data for correlations and patterns
4. **Visualization**: Interactive charts and graphs display insights
5. **Insights Generation**: AI provides actionable recommendations

## 🧮 Machine Learning Models

### Linear Regression
- **Purpose**: Predicts assessment scores based on cognitive skills
- **Features**: Comprehension, attention, focus, retention, engagement time
- **Output**: Predicted score with confidence level

### K-Means Clustering
- **Purpose**: Groups students into learning personas
- **Features**: Four cognitive skills
- **Output**: 4 distinct student archetypes

## 📈 Learning Personas

1. **🌟 High Achievers**: Excellent across all cognitive skills
2. **⚖️ Balanced Learners**: Good overall performance with consistent skills
3. **📚 Developing Students**: Average performance with growth potential
4. **🆘 Struggling Learners**: Require targeted support and intervention

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bharadwaj204**
- GitHub: [@Bharadwaj204](https://github.com/Bharadwaj204)
- Project: [Student Performance Dashboard](https://github.com/Bharadwaj204/Student-Performance-Dashboard)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Recharts for beautiful data visualizations
- Tailwind CSS for utility-first styling
- The open-source community for inspiration

---

**⭐ Star this repository if you find it helpful!**
