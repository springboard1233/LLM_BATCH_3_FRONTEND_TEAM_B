import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, Lock, Cpu, Database, AlertTriangle, TrendingUp, CheckCircle, ArrowRight, Play, Pause, BarChart3, Activity, Layers, Zap, Brain, Users, Clock } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const LandingPage = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const { effectiveTheme } = useSettings();
  const isDarkTheme = effectiveTheme === 'dark';
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentStat, setCurrentStat] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const stats = [
    { value: "99.7%", label: "Detection Rate", color: "text-emerald-400" },
    { value: "0.02%", label: "False Positives", color: "text-blue-400" },
    { value: "50ms", label: "Response Time", color: "text-purple-400" },
    { value: "24/7", label: "Protection", color: "text-orange-400" }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Neural Network Analysis",
      description: "Advanced deep learning algorithms that adapt and evolve with emerging fraud patterns",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Real-Time Monitoring",
      description: "Continuous surveillance of all transactions with instant threat detection and response",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Multi-Layer Security",
      description: "Comprehensive protection with behavioral analysis, device fingerprinting, and risk scoring",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Predictive Analytics",
      description: "Forecast potential fraud attempts before they happen using predictive modeling",
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
          isDarkTheme ? 'bg-blue-500/10' : 'bg-blue-500/20'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
          isDarkTheme ? 'bg-purple-500/10' : 'bg-purple-500/20'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${
          isDarkTheme ? 'bg-gradient-to-r from-emerald-500/5 to-blue-500/5' : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10'
        }`}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-bounce ${
              isDarkTheme ? 'bg-white/20' : 'bg-blue-500/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`relative z-10 flex items-center justify-between px-8 py-6 border-b ${
        isDarkTheme 
          ? 'bg-black/20 backdrop-blur-md border-white/10' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Shield className="h-10 w-10 text-emerald-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
          </div>
          <div>
            <span className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>SecureGuard</span>
            <div className="text-xs text-emerald-400 font-medium">AI Fraud Detection</div>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => scrollToSection('features')}
            className={`font-medium transition-colors ${
              isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('solutions')}
            className={`font-medium transition-colors ${
              isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Solutions
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className={`font-medium transition-colors ${
              isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Pricing
          </button>
          <button 
            onClick={() => navigate('/login')}
            className={`font-medium transition-colors ${
              isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className={`px-4 py-2 border-2 rounded-full font-semibold transition-all duration-300 ${
              isDarkTheme 
                ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10' 
                : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            Sign Up
          </button>
          <button 
            onClick={onGetStarted}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 font-semibold"
          >
            Guest Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-full text-sm mb-8 backdrop-blur-sm ${
            isDarkTheme ? 'text-emerald-300' : 'text-emerald-700'
          }`}>
            <Zap className="h-4 w-4 mr-2 animate-pulse" />
            Next-Generation AI Protection
          </div>
          
          {/* Main Heading */}
          <h1 className={`text-6xl md:text-7xl font-bold mb-8 leading-tight ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>
            Stop Fraud
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 animate-pulse">
              Before It Strikes
            </span>
          </h1>
          
          {/* Subheading */}
          <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Harness the power of artificial intelligence to detect, prevent, and eliminate fraud 
            with unprecedented accuracy and speed.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={onGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-emerald-500/25 flex items-center"
            >
              Start Protecting Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className={`px-8 py-4 border-2 rounded-full text-lg font-semibold transition-all duration-300 ${
              isDarkTheme 
                ? 'border-white/20 text-white hover:bg-white/10 backdrop-blur-sm' 
                : 'border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}>
              Watch Demo
            </button>
          </div>
          
          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center p-6 rounded-2xl border transition-all duration-500 ${
                  isDarkTheme 
                    ? 'bg-black/20 backdrop-blur-sm border-white/10' 
                    : 'bg-white border-gray-200 shadow-md'
                } ${
                  currentStat === index ? 'scale-105 border-emerald-500/50 shadow-lg shadow-emerald-500/20' : ''
                }`}
              >
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`relative z-10 px-8 py-20 ${
        isDarkTheme ? 'bg-black/10 backdrop-blur-sm' : 'bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Intelligent Protection
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400"> Ecosystem</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Our AI-powered platform combines multiple detection methods to create an impenetrable shield against fraud
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Feature Cards */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    isDarkTheme 
                      ? activeFeature === index 
                        ? 'bg-white/10 border-white/30 shadow-xl' 
                        : 'bg-black/20 border-white/10 hover:bg-white/5'
                      : activeFeature === index
                        ? 'bg-emerald-50 border-emerald-300 shadow-xl'
                        : 'bg-white border-gray-200 hover:bg-gray-50 shadow-md'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                      <p className={`leading-relaxed ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Interactive Visualization */}
            <div className="relative">
              <div className={`rounded-3xl p-8 border ${
                isDarkTheme 
                  ? 'bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border-white/10' 
                  : 'bg-white border-gray-200 shadow-lg'
              }`}>
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Live Threat Detection</h3>
                  <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>Real-time fraud analysis in action</p>
                </div>
                
                {/* Mock Dashboard */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-medium">Transaction Verified</span>
                    </div>
                    <span className="text-emerald-400 font-bold">$1,250.00</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-white font-medium">Fraud Detected</span>
                    </div>
                    <span className="text-red-400 font-bold">$5,000.00</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">Under Review</span>
                    </div>
                    <span className="text-yellow-400 font-bold">$750.00</span>
                  </div>
                </div>
                
                {/* Animated Progress */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">AI Analysis Progress</span>
                    <span className="text-blue-400 font-bold">94%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{width: '94%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className={`relative z-10 px-8 py-20 ${
        isDarkTheme ? 'bg-black/5 backdrop-blur-sm' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Complete Fraud
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400"> Solutions</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Tailored solutions for every industry and business size
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Banking & Finance */}
            <div className={`p-8 rounded-3xl border transition-all duration-300 ${
              isDarkTheme 
                ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-white/10 hover:border-blue-500/30' 
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200 hover:border-blue-300 shadow-md'
            }`}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Banking & Finance</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Comprehensive fraud protection for banks, credit unions, and financial institutions with regulatory compliance.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Transaction monitoring
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Account takeover protection
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Regulatory compliance
                </li>
              </ul>
            </div>

            {/* E-commerce */}
            <div className={`p-8 rounded-3xl border transition-all duration-300 ${
              isDarkTheme 
                ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border-white/10 hover:border-emerald-500/30' 
                : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-gray-200 hover:border-emerald-300 shadow-md'
            }`}>
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">E-commerce</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Protect online transactions and prevent chargebacks with real-time fraud detection for e-commerce platforms.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Payment fraud prevention
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Chargeback reduction
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Customer verification
                </li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className={`p-8 rounded-3xl border transition-all duration-300 ${
              isDarkTheme 
                ? 'bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border-white/10 hover:border-orange-500/30' 
                : 'bg-gradient-to-br from-orange-50 to-red-50 border-gray-200 hover:border-orange-300 shadow-md'
            }`}>
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Scalable fraud detection for large enterprises with custom integrations and dedicated support.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Advanced analytics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400"> Pricing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="p-8 bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <p className="text-gray-400 mb-6">Perfect for small businesses</p>
                <div className="text-4xl font-bold text-white mb-2">$99</div>
                <div className="text-gray-400">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Up to 10,000 transactions/month
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Basic fraud detection
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Email support
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Standard reporting
                </li>
              </ul>
              <button className="w-full px-6 py-3 border-2 border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                Get Started
              </button>
            </div>

            {/* Professional Plan */}
            <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <p className="text-gray-400 mb-6">For growing businesses</p>
                <div className="text-4xl font-bold text-white mb-2">$299</div>
                <div className="text-gray-400">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Up to 100,000 transactions/month
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Advanced AI detection
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  API access
                </li>
              </ul>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className={`p-8 rounded-3xl border transition-all duration-300 ${
              isDarkTheme 
                ? 'bg-black/20 backdrop-blur-sm border-white/10 hover:border-white/20' 
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-md'
            }`}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-gray-400 mb-6">For large organizations</p>
                <div className="text-4xl font-bold text-white mb-2">Custom</div>
                <div className="text-gray-400">contact us</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Unlimited transactions
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Custom AI models
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Dedicated support
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  SLA guarantee
                </li>
              </ul>
              <button className="w-full px-6 py-3 border-2 border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of organizations protecting billions in transactions daily
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className={`p-6 rounded-2xl border ${
              isDarkTheme ? 'bg-black/20 backdrop-blur-sm border-white/10' : 'bg-white border-gray-200 shadow-md'
            }`}>
              <Database className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Enterprise Scale</h3>
              <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>Process millions of transactions per second with 99.99% uptime</p>
            </div>
            
            <div className={`p-6 rounded-2xl border ${
              isDarkTheme ? 'bg-black/20 backdrop-blur-sm border-white/10' : 'bg-white border-gray-200 shadow-md'
            }`}>
              <Layers className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Easy Integration</h3>
              <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>Deploy in minutes with our comprehensive API and SDK suite</p>
            </div>
            
            <div className={`p-6 rounded-2xl border ${
              isDarkTheme ? 'bg-black/20 backdrop-blur-sm border-white/10' : 'bg-white border-gray-200 shadow-md'
            }`}>
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>24/7 Support</h3>
              <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>Expert support team available around the clock for your peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-3xl p-12 text-center border ${
            isDarkTheme 
              ? 'bg-gradient-to-r from-emerald-600/20 to-blue-600/20 backdrop-blur-sm border-white/20' 
              : 'bg-gradient-to-r from-emerald-50 to-blue-50 border-gray-200 shadow-lg'
          }`}>
            <h2 className={`text-4xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Ready to Eliminate Fraud?
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Start your journey to bulletproof fraud protection. Deploy our AI-powered solution in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-emerald-500/25 flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className={`px-8 py-4 border-2 rounded-full text-lg font-semibold transition-all duration-300 ${
                isDarkTheme 
                  ? 'border-white/30 text-white hover:bg-white/10' 
                  : 'border-gray-300 text-gray-900 hover:bg-gray-100'
              }`}>
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 px-8 py-12 border-t ${
        isDarkTheme 
          ? 'bg-black/30 backdrop-blur-sm border-white/10' 
          : 'bg-gray-100 border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-8 w-8 text-emerald-400" />
                <div>
                  <span className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>SecureGuard</span>
                  <div className="text-xs text-emerald-400">AI Fraud Detection</div>
                </div>
              </div>
              <p className={`max-w-md ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                Advanced artificial intelligence platform designed to protect your business from fraud 
                with unmatched accuracy and real-time response capabilities.
              </p>
            </div>
            
            <div>
              <h4 className={`font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Platform</h4>
              <ul className={`space-y-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition-colors ${isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}`}>Features</a></li>
                <li><a href="#" className={`transition-colors ${isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}`}>API Documentation</a></li>
                <li><a href="#" className={`transition-colors ${isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}`}>Integrations</a></li>
                <li><a href="#" className={`transition-colors ${isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}`}>Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Company</h4>
              <ul className={`space-y-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition-colors ${isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}`}>About Us</a></li>
                <li><a href="#" className={`transition-colors ${isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}`}>Careers</a></li>
                <li><a href="#" className={`transition-colors ${isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}`}>Contact</a></li>
                <li><a href="#" className={`transition-colors ${isDarkTheme ? 'hover:text-white' : 'hover:text-gray-900'}`}>Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`border-t mt-8 pt-8 text-center ${
            isDarkTheme ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-600'
          }`}>
            <p>&copy; 2024 SecureGuard AI. All rights reserved. Protecting businesses worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;