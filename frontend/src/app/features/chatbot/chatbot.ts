import {Component, ElementRef, ViewChild, AfterViewChecked} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { MarkdownModule } from 'ngx-markdown'; // ✅ Import MarkdownModule

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const INITIAL_MESSAGE: Message = {
  sender: 'bot',
  text: 'Hello! How can I help you with your finances today?'
};

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkdownModule,
    NgOptimizedImage,
    // ✅ Add it to the imports array
  ],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  // ... (rest of the component logic remains the same) ...
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isOpen = false;
  isLoading = false;
  userInput = '';
  messages: Message[] = [INITIAL_MESSAGE];

  predeterminedQuestions: string[] = [
    'How much did I spend this month?',
    'What are my top 5 spending categories?',
    'Am I over my budget?',
    'Give me some tips to save money.'
  ];

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  askPredetermined(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  clearChat(): void {
    this.messages = [INITIAL_MESSAGE];
    this.isLoading = false;
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userId = this.authService.getUserId();
    if (!userId) {
      this.messages.push({ sender: 'bot', text: 'Could not identify user. Please try again.' });
      return;
    }

    this.messages.push({ sender: 'user', text: this.userInput });
    const userMessage = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    this.chatService.sendMessage(userId, userMessage).subscribe({
      next: (response) => {
        this.messages.push({ sender: 'bot', text: response.response });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({ sender: 'bot', text: 'Sorry, something went wrong. Please try again.' });
        this.isLoading = false;
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
