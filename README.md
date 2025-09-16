# Student Performance Dashboard

A comprehensive web application for analyzing cognitive skills and student performance using machine learning and interactive data visualizations.

## 🎯 Project Overview

This dashboard provides educators and administrators with powerful insights into student performance through:

- **Cognitive Skills Analysis**: Comprehensive evaluation of comprehension, attention, focus, and retention
- **Performance Prediction**: Machine learning models to predict assessment scores
- **Learning Personas**: Student clustering to identify distinct learning patterns
- **Interactive Visualizations**: Dynamic charts and graphs for data exploration
- **Actionable Insights**: Data-driven recommendations for educational improvement

## 🚀 Live Demo

**Deployed Application**: [Coming Soon - Vercel Link]

**GitHub Repository**: [https://github.com/your-username/student-dashboard](https://github.com/your-username/student-dashboard)

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.0.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization library
- **Lucide React** - Modern icon library

### Data Analysis
- **Python** - Jupyter Notebook analysis
- **Custom ML Models** - TypeScript implementation
- **Statistical Analysis** - Correlation and clustering algorithms

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## 📊 Dataset Description

The application uses a synthetic dataset with 200 student records containing:

| Field | Description | Range |
|-------|-------------|-------|
| `student_id` | Unique identifier | STU0001-STU0200 |
| `name` | Student full name | Generated names |
| `class` | Academic subject/class | 18 different classes |
| `comprehension` | Reading and understanding ability | 0-100 |
| `attention` | Ability to focus on tasks | 0-100 |
| `focus` | Sustained concentration capability | 0-100 |
| `retention` | Memory and recall ability | 0-100 |
| `assessment_score` | Academic performance score | 0-100 |
| `engagement_time` | Daily study time in minutes | 30-300 |

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/student-dashboard.git
   cd student-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
student-dashboard/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Charts.tsx      # Data visualizations
│   │   ├── StudentTable.tsx # Data table
│   │   ├── StatsCard.tsx   # Statistics cards
│   │   └── InsightsSection.tsx # Insights & recommendations
│   ├── data/              # Data files
│   │   ├── generateStudentData.ts # Data generation
│   │   └── students.csv   # Dataset
│   └── lib/               # Utilities
│       ├── mlModels.ts    # Machine learning models
│       └── utils.ts       # Helper functions
├── analysis/              # Jupyter notebook analysis
│   └── student_performance_analysis.ipynb
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Features

### 1. Interactive Dashboard
- **Overview Statistics**: Key performance metrics at a glance
- **Cognitive Skills Breakdown**: Detailed analysis of mental abilities
- **Performance Distribution**: Visual representation of grade ranges
- **Class Filtering**: Dynamic filtering by academic subjects

### 2. Advanced Analytics
- **Correlation Analysis**: Relationships between cognitive skills and performance
- **Machine Learning Predictions**: Assessment score predictions using ML models
- **Learning Personas**: Student clustering into distinct learning profiles
- **Trend Analysis**: Performance patterns and insights

### 3. Data Visualizations
- **Bar Charts**: Class performance comparisons
- **Scatter Plots**: Correlation visualizations
- **Radar Charts**: Individual student cognitive profiles
- **Pie Charts**: Performance distribution
- **Interactive Tables**: Searchable and sortable data views

### 4. Student Management
- **Search & Filter**: Find students by name, ID, or class
- **Detailed Profiles**: Individual student cognitive analysis
- **Performance Tracking**: Historical and predicted performance
- **Export Functionality**: CSV data export capabilities

### 5. Insights & Recommendations
- **Automated Analysis**: AI-driven insights from data patterns
- **Actionable Recommendations**: Data-driven improvement suggestions
- **Performance Alerts**: Identification of at-risk students
- **Best Practices**: Success pattern analysis

## 🧠 Machine Learning Models

### Linear Regression Model
- **Purpose**: Predict assessment scores based on cognitive skills
- **Features**: Comprehension, attention, focus, retention, engagement time
- **Performance**: R² score and MSE metrics provided
- **Implementation**: Custom TypeScript implementation for browser execution

### K-Means Clustering
- **Purpose**: Identify distinct learning personas
- **Features**: Four cognitive skills (comprehension, attention, focus, retention)
- **Clusters**: 4 learning personas with unique characteristics
- **Applications**: Personalized learning recommendations

## 📈 Key Findings

### Correlation Analysis
- **Strongest Predictor**: Comprehension shows highest correlation with assessment scores
- **Skill Relationships**: Strong interdependence between cognitive abilities
- **Engagement Impact**: Study time moderately correlates with performance

### Learning Personas Identified
1. **High Achievers**: Excellent across all cognitive skills
2. **Balanced Learners**: Good overall performance with consistent skills
3. **Developing Students**: Average performance with growth potential
4. **Struggling Learners**: Require targeted support and intervention

### Performance Insights
- **Class Variation**: Significant performance differences across subjects
- **Risk Factors**: Early identification of struggling students
- **Success Patterns**: Characteristics of high-performing students

## 🎯 Usage Guide

### For Educators
1. **Monitor Class Performance**: Use overview statistics to track overall progress
2. **Identify At-Risk Students**: Check insights section for students needing support
3. **Personalize Learning**: Apply learning persona insights for tailored instruction
4. **Track Correlations**: Understand which cognitive skills impact performance most

### For Administrators
1. **Compare Classes**: Analyze performance differences across subjects
2. **Resource Allocation**: Identify classes or students needing additional support
3. **Data-Driven Decisions**: Use ML predictions for proactive interventions
4. **Performance Trends**: Monitor institutional performance metrics

### For Researchers
1. **Data Export**: Export filtered data for external analysis
2. **Model Performance**: Evaluate ML model accuracy and reliability
3. **Pattern Analysis**: Explore relationships in cognitive skills data
4. **Validation Studies**: Compare findings with educational research

## 🔮 Future Enhancements

### Planned Features
- **Real-time Data Integration**: Connect with actual student information systems
- **Advanced ML Models**: Implement deep learning for better predictions
- **Temporal Analysis**: Track performance changes over time
- **Intervention Tracking**: Monitor effectiveness of implemented recommendations
- **Mobile Responsiveness**: Enhanced mobile experience
- **Multi-language Support**: Internationalization capabilities

### Technical Improvements
- **Database Integration**: Replace CSV with proper database
- **API Development**: RESTful API for data access
- **Authentication**: User management and role-based access
- **Real-time Updates**: Live data synchronization
- **Performance Optimization**: Enhanced loading and rendering

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Write descriptive commit messages
4. Add comments for complex logic
5. Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. **Check the Issues**: Search existing GitHub issues
2. **Create New Issue**: Describe the problem with steps to reproduce
3. **Documentation**: Refer to this README for common questions
4. **Contact**: Reach out to the development team

## 🎓 Educational Impact

This dashboard demonstrates the power of data analytics in education by:

- **Quantifying Learning**: Converting cognitive abilities into measurable metrics
- **Predictive Analytics**: Using ML to forecast student performance
- **Personalized Education**: Tailoring instruction based on learning personas
- **Evidence-Based Decisions**: Supporting educational choices with data insights
- **Early Intervention**: Identifying at-risk students before problems escalate

## 📚 References & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Educational Data Mining Research](https://en.wikipedia.org/wiki/Educational_data_mining)

---

**Built with ❤️ for educational excellence and data-driven learning insights.**