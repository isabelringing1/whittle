import java.io.File; 
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.*;

public class SolutionsFinder {
    public static final String SINGLE_WORD_SOLUTIONS = "single_word_solutions.txt"; 

    public static final String MULTI_WORD_SOLUTIONS = "eleven_letter_one_space_words.txt"; 

    // set of all english words that are individual solutions
    public static final Set<String> SINGLE_WORD_SOLUTIONS_DICTIONARY = new HashSet<>();

    public static void main(String[] args){
        try {
            File myObj = new File(SINGLE_WORD_SOLUTIONS);
            Scanner myReader = new Scanner(myObj);
            while (myReader.hasNextLine()) {
                String word = myReader.nextLine().trim();
                if (!word.isEmpty()) {
                    SINGLE_WORD_SOLUTIONS_DICTIONARY.add(word);
                }
            }
            myReader.close();

            File myObj2 = new File(MULTI_WORD_SOLUTIONS);
            Scanner myReader2 = new Scanner(myObj2);
            while (myReader2.hasNextLine()) {
                String multi_word = myReader2.nextLine().trim();
                if (!multi_word.isEmpty()) {
                    boolean all_single_word_solutions = true;
                    for (String word : multi_word.split(" ")) {
                        if (!SINGLE_WORD_SOLUTIONS_DICTIONARY.contains(word)){
                            all_single_word_solutions = false;
                            break;
                        }
                    }
                    if (!all_single_word_solutions){
                        System.out.println(multi_word);
                    }
                }
            }
            myReader2.close();

        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }

}