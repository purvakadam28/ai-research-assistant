# 🤖 AI Research Assistant

An Agentic AI Research Assistant built using **n8n** and **Google Gemini**.

The assistant accepts a user's research question, analyzes the request using an AI Agent, uses external tools when required, and generates a concise, structured response.

## 🚀 Live Demo

[Open AI Research Assistant](https://purvakadam.app.n8n.cloud/assistant/cba1d5b0-1b54-4e49-8530-3163685c91c3)

> Note: The live demo depends on the availability of the configured Google Gemini API quota.

## ✨ Features

- 🤖 AI Agent powered by Google Gemini
- 🌐 Web Search for current and research-based information
- 🧠 Conversational Memory
- 🧮 Calculator for mathematical queries
- 📝 Structured responses
- 🔗 Source links for researched information
- ☁️ Deployed using n8n Cloud

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │      User        │
                    │  Research Query  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Chat Trigger   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    AI Agent      │
                    │ Research Agent   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌────────────┐
        │  Gemini  │   │  Memory  │   │ Web Search │
        │   LLM    │   │          │   │            │
        └──────────┘   └──────────┘   └────────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                       ┌──────────┐
                       │Calculator│
                       └────┬─────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ Final Structured │
                    │     Response     │
                    └──────────────────┘
